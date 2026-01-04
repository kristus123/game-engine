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
				const keys = this.pushService.generateVAPIDKeys()
				res.json({
					publicKey: keys.publicKey,
					message: 'Save privateKey securely on server and configure WebPushService',
				})
			}
			catch (error) {
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
				res.status(400).json({ error: error.message })
			}
		})

		this.app.post('/push/subscribe', (req, res) => {
			try {
				const subscription = req.body

				const added = this.pushService.subscribe(subscription)

				res.status(201).json({
					success: true,
					added: added,
					totalSubscriptions: this.pushService.getSubscriptionCount(),
				})
			}
			catch (error) {
				res.status(400).json({ error: error.message })
			}
		})

		this.app.post('/push/unsubscribe', (req, res) => {
			try {
				const { endpoint } = req.body

				const removed = this.pushService.unsubscribe(endpoint)

				res.json({
					success: true,
					removed: removed,
					totalSubscriptions: this.pushService.getSubscriptionCount(),
				})
			}
			catch (error) {
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

				res.json({
					success: true,
					results: results,
				})
			}
			catch (error) {
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
				res.status(500).json({ error: error.message })
			}
		})

		this.app.get('/push/health', (req, res) => {
			res.json({
				status: 'ok',
				configured: this.pushService.configured,
				subscriptions: this.pushService.getSubscriptionCount(),
			})
		})
	}

	start() {
		this.app.listen(this.port, () => {
			console.log(`Push notification server running on port ${this.port}`)
			console.log(`Health check: http://localhost:${this.port}/push/health`)
		})
	}
}
