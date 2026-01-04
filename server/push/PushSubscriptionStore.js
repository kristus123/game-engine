import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default class PushSubscriptionStore {
	constructor(filePath = path.join(__dirname, 'subscriptions.json')) {
		this.filePath = filePath
		this.subscriptions = this.load()
	}

	load() {
		try {
			if (fs.existsSync(this.filePath)) {
				const data = fs.readFileSync(this.filePath, 'utf8')
				return JSON.parse(data)
			}
			return []
		}
		catch (error) {
			console.error('Error loading subscriptions:', error)
			return []
		}
	}

	save() {
		try {
			fs.writeFileSync(this.filePath, JSON.stringify(this.subscriptions, null, 2))
		}
		catch (error) {
			console.error('Error saving subscriptions:', error)
		}
	}

	add(subscription) {
		const exists = this.subscriptions.some(
			sub => sub.endpoint === subscription.endpoint
		)

		if (!exists) {
			this.subscriptions.push(subscription)
			this.save()
			return true
		}

		return false
	}

	remove(endpoint) {
		const initialLength = this.subscriptions.length
		this.subscriptions = this.subscriptions.filter(
			sub => sub.endpoint !== endpoint
		)

		if (this.subscriptions.length !== initialLength) {
			this.save()
			return true
		}

		return false
	}

	getAll() {
		return this.subscriptions
	}

	get count() {
		return this.subscriptions.length
	}
}
