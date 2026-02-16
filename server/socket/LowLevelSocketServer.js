import { WebSocketServer } from 'ws'
import { Flask } from '#root/server/http/Flask.js'

export default class {
	constructor() {
		this.actions = {}
	}

	start() {
		const server = Flask.server

		const webSocketServer = new WebSocketServer({ server })

		webSocketServer.on('connection', (client, request) => {

			const urlParameters = new URLSearchParams(request.url.split('?')[1])
			const clientId = urlParameters.get('clientId')
			this.onConnection(client, clientId)

			client.on('message', data => {
				try {
					data = JSON.parse(data)

					if (this.actions[data.action]) {
						this.actions[data.action](client, clientId, data)
					}
				}
				catch (e) {
					console.log(e)
				}
			})

			client.on('close', () => {
				this.onClose(client, clientId)
			})
		})
	}

	on(action, callback) {
		this.actions[action] = callback
	}
}
