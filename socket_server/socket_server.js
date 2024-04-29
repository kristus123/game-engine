const fs = require('fs')
const Server = require('./Server')
const crypto = require('crypto')

const server = new Server()

server.onConnection = client => {
	server.clientsAndPlayerIds.push({
		client: client,
		playerId: crypto.randomUUID(),
	})
}

server.onClose = client => {
	// todo remove player
}

server.on('UPDATE_PLAYER_POSITION', (client, data) => {
	server.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		x: data.x,
		y: data.y,
	})
})

server.start()
