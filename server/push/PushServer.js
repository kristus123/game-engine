import express from 'express'
import cors from 'cors'
import WebPushService from './WebPushService.js'

export default class PushServer {
	constructor(port = 3001) {
		this.port = port
		this.app = express()
		this.pushService = new WebPushService()

		this.setupMiddleware()
		this.setupRoutes()
	}

	setupMiddleware() {
		this.app.use(express.json())
		this.app.use(cors())
	}

	setupRoutes() {
		this.app.post('/push/vapid-public-key', (req, res) => {
			try {
				const publicKey = this.pushService.getPublicKey()
				res.json({ publicKey: publicKey })
			}
			catch (error) {
				console.error('❌ Error getting public key:', error.message)
				res.status(500).json({ error: error.message })
			}
		})

		// Endpoint to generate NEW VAPID keys (for initial setup only)
		this.app.post('/push/generate-vapid-keys', (req, res) => {
			try {
				const keys = this.pushService.generateVAPIDKeys()
				console.log('✅ New VAPID keys generated')
				res.json({
					publicKey: keys.publicKey,
					privateKey: keys.privateKey,
					message: 'Save these keys securely and configure WebPushService in main.js'
				})
			}
			catch (error) {
				console.error('❌ Error generating VAPID keys:', error.message)
				res.status(500).json({ error: error.message })
			}
		})

		this.app.post('/push/configure', (req, res) => {
			try {
				const { publicKey, privateKey, subject } = req.body
				this.pushService.configure({ publicKey, privateKey, subject })

				res.json({
					success: true,
					message: 'Web push configured successfully',
				})
			}
			catch (error) {
				console.error('❌ Error configuring web push:', error.message)
				res.status(400).json({ error: error.message })
			}
		})

		this.app.post('/push/subscribe', (req, res) => {
			try {
				const subscription = req.body
				const added = this.pushService.subscribe(subscription)
				const totalSubs = this.pushService.getSubscriptionCount()
				
				if (added) {
					console.log(`✅ New subscription. Total: ${totalSubs}`)
				}

				res.status(201).json({
					success: true,
					added: added,
					totalSubscriptions: totalSubs,
				})
			}
			catch (error) {
				console.error('❌ Error adding subscription:', error.message)
				res.status(400).json({ error: error.message })
			}
		})

		this.app.post('/push/unsubscribe', (req, res) => {
			try {
				const { endpoint } = req.body
				const removed = this.pushService.unsubscribe(endpoint)
				const totalSubs = this.pushService.getSubscriptionCount()
				
				if (removed) {
					console.log(`✅ Unsubscribed. Total: ${totalSubs}`)
				}

				res.json({
					success: true,
					removed: removed,
					totalSubscriptions: totalSubs,
				})
			}
			catch (error) {
				console.error('❌ Error removing subscription:', error.message)
				res.status(400).json({ error: error.message })
			}
		})

		this.app.post('/push/send', async (req, res) => {
			try {
				const { title, body, icon, badge, data } = req.body

				const payload = {
					title: title || 'Notification',
					body: body || '',
					icon: icon || '/icon.png',
					badge: badge || '/badge.png',
					data: data || {},
				}

				const results = await this.pushService.sendToAll(payload)
				const total = results.sent + results.failed
				console.log(`✅ Sent: ${results.sent}/${total}, Failed: ${results.failed}`)

				res.json({
					success: true,
					results: results,
				})
			}
			catch (error) {
				console.error('❌ Error sending notifications:', error.message)
				res.status(500).json({ error: error.message })
			}
		})

		// Send notification to a single user
		this.app.post('/push/sendone', async (req, res) => {
			try {
				const { endpoint, title, body, icon, badge, data } = req.body

				if (!endpoint) {
					return res.status(400).json({ error: 'Endpoint required' })
				}

				const payload = {
					title: title || 'Notification',
					body: body || '',
					icon: icon || '/icon.png',
					badge: badge || '/badge.png',
					data: data || {},
				}

				const result = await this.pushService.sendToOne(endpoint, payload)
				
				if (result.success) {
					console.log('✅ Notification sent to user')
				}

				res.json({
					success: result.success,
					error: result.error
				})
			}
			catch (error) {
				console.error('❌ Error sending notification:', error.message)
				res.status(500).json({ error: error.message })
			}
		})

		this.app.get('/push/subscriptions', (req, res) => {
			try {
				const subscriptions = this.pushService.getAllSubscriptions()

				res.json({
					count: subscriptions.length,
					subscriptions: subscriptions.map(sub => ({
						endpoint: sub.endpoint,
					})),
				})
			}
			catch (error) {
				console.error('❌ Error listing subscriptions:', error.message)
				res.status(500).json({ error: error.message })
			}
		})

		this.app.get('/push/health', (req, res) => {
			const health = {
				status: 'ok',
				configured: this.pushService.configured,
				subscriptions: this.pushService.getSubscriptionCount(),
			}
			res.json(health)
		})

		// Verify if an endpoint exists in database
		this.app.post('/push/verify', (req, res) => {
			try {
				const { endpoint } = req.body
				
				if (!endpoint) {
					return res.status(400).json({ error: 'Endpoint required' })
				}

				const exists = this.pushService.hasSubscription(endpoint)

				res.json({
					exists: exists,
					endpoint: endpoint
				})
			}
			catch (error) {
				console.error('❌ Error verifying endpoint:', error.message)
				res.status(500).json({ error: error.message })
			}
		})
	}

	start() {
		this.app.listen(this.port, () => {
			console.log(`Push notification server running on port ${this.port}`)
			console.log(`Health check: http://localhost:${this.port}/push/health`)
		})
	}
}
