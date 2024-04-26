const WebSocket = require('ws')

const webSocketServer = new WebSocket.Server({ port: 8080 })

const clients = []

webSocketServer.on('connection', webSocketClient => {
	console.log('New client connected')

	clients.push(webSocketClient)

	webSocketClient.on('message', message => {
		console.log('Received:', JSON.parse(message))

		clients.forEach(client => {
			if (client !== webSocketClient && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({ho: true}))
			}
		})
	})


	webSocketClient.on('close', () => {
		console.log('Client disconnected')

		const index = clients.indexOf(webSocketClient)
		if (index > -1) {
			const disconnectedUserId = clients[index].userId // Assuming you have a userId property
			clients.splice(index, 1)

			// Send a message to all other clients
			const message = JSON.stringify({ action: 'userDisconnected', userId: disconnectedUserId })
			clients.forEach(client => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(message)
				}
			})
		}
	})
})
