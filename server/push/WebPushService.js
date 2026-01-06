import webpush from 'web-push'
import PushSubscriptionStore from './PushSubscriptionStore.js'

export default class WebPushService {
	constructor() {
		this.store = new PushSubscriptionStore()
		this.configured = false
		this.vapidKeys = null
	}

	configure(vapidKeys) {
		if (!vapidKeys || !vapidKeys.publicKey || !vapidKeys.privateKey) {
			throw new Error('VAPID keys required: { publicKey, privateKey, subject }')
		}

		webpush.setVapidDetails(
			vapidKeys.subject || 'mailto:example@yourdomain.com',
			vapidKeys.publicKey,
			vapidKeys.privateKey
		)

		this.vapidKeys = vapidKeys
		this.configured = true
		console.log('Web Push Service configured successfully')
	}

	getPublicKey() {
		if (!this.configured || !this.vapidKeys) {
			throw new Error('Web Push Service not configured. Please configure VAPID keys first.')
		}
		return this.vapidKeys.publicKey
	}

	generateVAPIDKeys() {
		return webpush.generateVAPIDKeys()
	}

	subscribe(subscription) {
		if (!subscription || !subscription.endpoint) {
			throw new Error('Invalid subscription object')
		}

		return this.store.add(subscription)
	}

	unsubscribe(endpoint) {
		if (!endpoint) {
			throw new Error('Endpoint required for unsubscribe')
		}

		return this.store.remove(endpoint)
	}

	async sendNotification(subscription, payload) {
		if (!this.configured) {
			throw new Error('WebPushService not configured. Call configure() first.')
		}

		try {
			await webpush.sendNotification(subscription, JSON.stringify(payload))
			return { success: true }
		}
		catch (error) {
			console.error('Error sending notification:', error)

			if (error.statusCode === 410 || error.statusCode === 404) {
				this.store.remove(subscription.endpoint)
				console.log('Removed invalid subscription')
			}

			return { success: false, error: error.message }
		}
	}

	async sendToAll(payload) {
		if (!this.configured) {
			throw new Error('WebPushService not configured. Call configure() first.')
		}

		const subscriptions = this.store.getAll()
		const results = {
			sent: 0,
			failed: 0,
			errors: [],
		}

		for (const subscription of subscriptions) {
			const result = await this.sendNotification(subscription, payload)

			if (result.success) {
				results.sent++
			}
			else {
				results.failed++
				results.errors.push({
					endpoint: subscription.endpoint,
					error: result.error,
				})
			}
		}

		return results
	}

	async sendToOne(endpoint, payload) {
		if (!this.configured) {
			throw new Error('WebPushService not configured. Call configure() first.')
		}

		const subscription = this.store.getAll().find(sub => sub.endpoint === endpoint)
		
		if (!subscription) {
			throw new Error('Subscription not found')
		}

		return await this.sendNotification(subscription, payload)
	}

	hasSubscription(endpoint) {
		if (!endpoint) {
			return false
		}
		return this.store.getAll().some(sub => sub.endpoint === endpoint)
	}

	getSubscriptionCount() {
		return this.store.count
	}

	getAllSubscriptions() {
		return this.store.getAll()
	}
}
