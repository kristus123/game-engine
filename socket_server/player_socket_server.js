const SocketServer = require('./SocketServer')

const s = new SocketServer(8080)

s.onConnection = client => {

	s.sendToClient(client, {
		action: "CONNECTED_PLAYERS",
		clientIds: s.allClientIds
		.filter(clientId => clientId != s.clientIdFrom[client]),
	})

	s.sendToOthers(client, {
		action: "NEW_PLAYER_CONNECTED",
		clientId:  s.clientIdFrom[client],
	})
}

s.onClose = (client, clientId) => {
	s.sendToOthers(client, {
		action: 'PLAYER_DISCONNECTED',
		clientId: clientId,
	})
}

s.on('UPDATE_PLAYER_POSITION', (client, data) => {
	console.log(data)
	s.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		clientId: s.clientIdFrom[client],
		x: data.x,
		y: data.y,
	})
})

s.start()
