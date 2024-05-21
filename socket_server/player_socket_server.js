const SocketServer = require('./SocketServer')

const s = new SocketServer(8080)

s.onConnection = (client, clientId) => {
	s.sendToOthers(client, {
		action: 'CONNECT_PLAYER',
		clientId: clientId,
	})
	for (let i = 0; i < s.allClientIds.length; i++) {
		const id = s.allClientIds[i];
		if(id == clientId)continue;
		s.sendToClient(client,{
			action: 'CONNECT_PLAYER',
			clientId: id
		})
		
	}
}

s.onClose = (client, clientId) => {
	s.sendToOthers(client, {
		action: 'PLAYER_DISCONNECTED',
		clientId: clientId,
	})
}

s.on('UPDATE_PLAYER_POSITION', (client, clientId, data) => {
	s.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		clientId: clientId,
		x: data.x,
		y: data.y,
	})
})

s.on('UPDATE_MOUSE_POSITION', (client, clientId, data) => {
	s.sendToOthers(client, {
		action: 'UPDATE_MOUSE_POSITION',
		clientId: clientId,
		x: data.x,
		y: data.y,
	})
})


s.start()
