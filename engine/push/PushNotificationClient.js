export class PushNotificationClient {
	constructor(serverUrl = 'http://localhost:3001') {
		this.serverUrl = serverUrl
		this.subscription = null
	}

	async requestPermission() {
		if (!('Notification' in window)) {
			throw new Error('This browser does not support notifications')
		}

		const permission = await Notification.requestPermission()

		if (permission !== 'granted') {
			throw new Error('Notification permission denied')
		}

		return permission
	}

	async subscribe(publicKey) {
		await this.requestPermission()

		if (!('serviceWorker' in navigator)) {
			throw new Error('Service Worker not supported')
		}

		const registration = await navigator.serviceWorker.ready

		const subscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: this.urlBase64ToUint8Array(publicKey),
		})

		await this.sendSubscriptionToServer(subscription)

		this.subscription = subscription

		return subscription
	}

	async unsubscribe() {
		if (!this.subscription) {
			return false
		}

		await this.subscription.unsubscribe()

		await fetch(`${this.serverUrl}/push/unsubscribe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				endpoint: this.subscription.endpoint,
			}),
		})

		this.subscription = null

		return true
	}

	async sendSubscriptionToServer(subscription) {
		const response = await fetch(`${this.serverUrl}/push/subscribe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(subscription),
		})

		if (!response.ok) {
			throw new Error('Failed to send subscription to server')
		}

		return response.json()
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

	async getPublicKey() {
		const response = await fetch(`${this.serverUrl}/push/vapid-public-key`, {
			method: 'POST',
		})

		const data = await response.json()

		return data.publicKey
	}

	get isSubscribed() {
		return this.subscription !== null
	}
}
