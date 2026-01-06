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

		// Check if using HTTPS or localhost (required for push notifications)
		if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
			console.error('Push notifications require HTTPS or localhost. Current:', location.protocol + '//' + location.hostname)
			return Promise.reject(new Error('Push notifications require HTTPS or localhost'))
		}

		return Notification.requestPermission().then(permission => {
			if (permission !== 'granted') {
				const reason = permission === 'denied' 
					? 'Notification permission was denied. Please enable it in browser settings.'
					: 'Notification permission was not granted.'
				console.error(reason)
				throw new Error(reason)
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
					console.log('Unsubscribing from existing subscription')
					return existingSubscription.unsubscribe().then(() => registration)
				}
				return registration
			})
		}).then(registration => {
			console.log('Subscribing to push notifications...')
			return registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: this.urlBase64ToUint8Array(publicKey),
			})
		}).then(subscription => {
			console.log('Push subscription created:', subscription.endpoint)
			return this.sendSubscriptionToServer(subscription).then(() => {
				this.subscription = subscription
				try {
					localStorage.setItem('pushSubscriptionEndpoint', subscription.endpoint)
				} catch (e) {
					// Safari private mode throws error on localStorage
					console.warn('Cannot save to localStorage:', e.message)
				}
				console.log('✅ Push notifications enabled successfully')
				return subscription
			})
		}).catch(error => {
			console.error('Push subscription failed:', error)
			throw error
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
