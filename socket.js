const WebSocket = require('ws')

const webSocketServer = new WebSocket.Server({ port: 8080 })

const clients = []

let i = 0
function uuid() {
	return i += 1
}

webSocketServer.on('connection', webSocketClient => {
	console.log('New client connected')

	const player = {
		action: "SET_PLAYER_ID",
		playerId: uuid(),
	}
	webSocketClient.send(JSON.stringify(player))
	clients.push(player)

	// clients.forEach(client => {
	// 	console.log("loading existing players")
	// 	if (client !== webSocketClient && client.readyState === WebSocket.OPEN) {
	// 		client.send(JSON.stringify({
	// 			action: "LOAD_EXISTING_PLAYERS",
	// 		}))
	// 	}
	// })

	webSocketClient.on('message', message => {
		message = JSON.parse(message)

		if (message.action == "UPDATE_PLAYER_POSITION") {
			clients.forEach(client => {
				if (client !== webSocketClient && client.readyState === WebSocket.OPEN) {
					client.send(JSON.stringify({
						action: "UPDATE_PLAYER_POSITION",
						position: message.position,
					}))
				}
			})
		}
	})

	webSocketClient.on('close', () => {
		console.log('Client disconnected')

		const index = clients.indexOf(webSocketClient)
		if (index > -1) {
			const message = JSON.stringify({
				action: 'PLAYER_DISCONNECTED',
				playerId: clients[index].playerId,
			})

			clients.splice(index, 1)

			clients.forEach(client => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(message)
				}
			})
		}
	})
})
