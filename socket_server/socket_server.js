const fs = require('fs');
const Server = require('./Server')
const crypto = require('crypto')

const server = new Server()

const world = JSON.parse(fs.readFileSync('data.json', 'utf8'));

server.onConnection = client => {

	server.clientsAndPlayerIds.push({
		client: client,
		playerId: crypto.randomUUID(),
	})

	server.sendToClient(client, {
		action: "GET_PLAYER_ID",
		playerId: server.getPlayerId(client),
	})

	server.sendToClient(client, {

		action: "PLAYERS_ONLINE",
		players: server.clientsAndPlayerIds.map(x => x.playerId),
	})

	server.sendToOthers(client, {
		action: "PLAYER_CONNECTED",
		playerId: server.getPlayerId(client),
	})
}

server.onClose = client => {
	server.sendToOthers(client, {
		action: 'PLAYER_DISCONNECTED',
		playerId: server.getPlayerId(client),
	})

	server.remove(client)
}

server.on("NEW_PLAYER", (client, data) => {
	server.sendToClient(client, {
		action: "WORLD",
		data: world,
	})
})

server.on('UPDATE_PLAYER_POSITION', (client, data) => {
	server.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		playerId: server.getPlayerId(client),
		x: data.x,
		y: data.y,
	})
})

server.start()
