const WebSocket = require('ws')

const webSocketServer = new WebSocket.Server({ port: 8080 })

const clients = []

let i = 0
function uuid() {
	return i += 1
}

webSocketServer.on('connection', webSocketClient => {
	console.log('New client connected')

	clients.push(webSocketClient)

	// clients.forEach(client => {
	// 	console.log("loading existing players")
	// 	if (client !== webSocketClient && client.readyState === WebSocket.OPEN) {
	// 		client.send(JSON.stringify({
	// 			action: "LOAD_EXISTING_PLAYERS",
	// 		}))
	// 	}
	// })



	webSocketClient.on('message', message => {
		// console.log('Received:', JSON.parse(message))

		clients.forEach(client => {
			if (client !== webSocketClient && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify({
					action: "UPDATE_PLAYER_POSITION",
					position: JSON.parse(message),
				}))
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
			const message = JSON.stringify({
				action: 'USER_DISCONNECTED',
				userId: disconnectedUserId
			})
			clients.forEach(client => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(message)
				}
			})
		}
	})
})
