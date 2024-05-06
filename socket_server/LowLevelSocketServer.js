const WebSocket = require('ws')

module.exports = class {
	constructor(port) {
		this.port = port

		this.actions = {}
	}

	start() {
		new WebSocket.Server({ port: this.port }).on('connection', (client, request) => {

			const urlParameters = new URLSearchParams(request.url.split('?')[1]);
			const clientUuid = urlParameters.get('clientUuid')

			this.onConnection(client, clientUuid)

			client.on('message', data => {
				data = JSON.parse(data)

				if (this.actions[data.action]) {
					this.actions[data.action](client, data)
				}
			})

			client.on('close', () => {
				this.onClose(client)
			})
		})
	}

	on(action, callback) {
		this.actions[action] = callback
	}
}
