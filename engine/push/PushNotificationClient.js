export class PushNotificationClient {
	constructor(serverUrl = 'http://localhost:3001') {
		this.serverUrl = serverUrl
		this.subscription = null
	}

	requestPermission() {
		if (!('Notification' in window)) {
			return Promise.reject(new Error('Notifications not supported'))
		}

		if (!('serviceWorker' in navigator)) {
			return Promise.reject(new Error('Service Workers not supported'))
		}

		if (!('PushManager' in window)) {
			return Promise.reject(new Error('Push messaging not supported'))
		}

		return Notification.requestPermission().then(permission => {
			if (permission !== 'granted') {
				throw new Error('Notification permission denied')
			}
			return permission
		})
	}

	subscribe(publicKey) {
		return this.requestPermission().then(() => {
			if (!('serviceWorker' in navigator)) {
				throw new Error('Service Worker not supported')
			}
			return navigator.serviceWorker.ready
		}).then(registration => {
			// Check for existing subscription and clear it first
			return registration.pushManager.getSubscription().then(existingSubscription => {
				if (existingSubscription) {
					return existingSubscription.unsubscribe().then(() => registration)
				}
				return registration
			})
		}).then(registration => {
			return registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: this.urlBase64ToUint8Array(publicKey),
			})
		}).then(subscription => {
			return this.sendSubscriptionToServer(subscription).then(() => {
				this.subscription = subscription
				try {
					localStorage.setItem('pushSubscriptionEndpoint', subscription.endpoint)
				} catch (e) {
					// Safari private mode throws error on localStorage
					console.warn('Cannot save to localStorage:', e.message)
				}
				console.log('✅ Push notifications enabled')
				return subscription
			})
		})
	}

	unsubscribe() {
		if (!this.subscription) {
			return Promise.resolve(false)
		}

		return this.subscription.unsubscribe().then(() => {
			return fetch(`${this.serverUrl}/push/unsubscribe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					endpoint: this.subscription.endpoint,
				}),
			})
		}).then(() => {
			this.subscription = null
			try {
				localStorage.removeItem('pushSubscriptionEndpoint')
			} catch (e) {}
			return true
		})
	}

	sendSubscriptionToServer(subscription) {
		return fetch(`${this.serverUrl}/push/subscribe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(subscription),
		}).then(response => {
			if (!response.ok) {
				throw new Error('Failed to send subscription to server')
			}
			return response.json()
		})
	}

	urlBase64ToUint8Array(base64String) {
		const padding = '='.repeat((4 - base64String.length % 4) % 4)
		const base64 = (base64String + padding)
			.replace(/-/g, '+')
			.replace(/_/g, '/')

		const rawData = window.atob(base64)
		const outputArray = new Uint8Array(rawData.length)

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i)
		}

		return outputArray
	}

	getPublicKey() {
		return fetch(`${this.serverUrl}/push/vapid-public-key`, {
			method: 'POST',
		}).then(response => {
			return response.json()
		}).then(data => {
			return data.publicKey
		})
	}

	get isSubscribed() {
		return this.subscription !== null
	}
}
