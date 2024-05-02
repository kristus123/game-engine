const fs = require('fs');
const Server = require('./Server')
const crypto = require('crypto')

const server = new Server()


const world = JSON.parse(fs.readFileSync('data.json', 'utf8'));

server.onConnection = client => {
}

server.onClose = client => {
	// todo remove player
}

server.on("NEW_PLAYER", (client, data) => {
	server.clientsAndPlayerIds.push({
		client: client,
		playerId: crypto.randomUUID(),
	})

	server.sendToClient(client, {
		action: "WORLD",
		data: world,
	})
	
})

server.on('UPDATE_PLAYER_POSITION', (client, data) => {
	server.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		x: data.x,
		y: data.y,
	})
})

server.start()
