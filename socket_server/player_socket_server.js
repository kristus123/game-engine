const SocketServer = require('./SocketServer')

const s = new SocketServer(8080)

s.onConnection = (client, clientId) => {

	for (const otherClientId of s.allClientIds) {
		s.sendToClient(client, {
			action: "CONNECT_PLAYER",
			clientId: otherClientId,
		})
	}

	s.sendToOthers(client, {
		action: "CONNECT_PLAYER",
		clientId:  clientId,
	})
}

s.onClose = (client, clientId) => {
	s.sendToOthers(client, {
		action: 'PLAYER_DISCONNECTED',
		clientId: clientId,
	})
}

s.on('UPDATE_PLAYER_POSITION', (client, data) => {
	s.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		clientId: s.clientIdFrom[client],
		x: data.x,
		y: data.y,
	})
})

s.start()
