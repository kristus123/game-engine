const Server = require('./Server')
const crypto = require('crypto')

const server = new Server()

server.onConnection = client => {
	server.clients.push({
		client: client,
		playerId: data.playerId,
	})

}

server.onClose = client => {

}

server.on('UPDATE_PLAYER_POSITION', (client, data) => {
	server.send(client, {
		action: 'UPDATE_PLAYER_POSITION',
		x: data.x,
		y: data.y,
	})
})

server.on('NEW_PLAYER', (client, data) => {
	server.clients.push({
		client: client,
		playerId: data.playerId,
	})
})

server.start()
