// const fs = require('fs');
// const world = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const Server = require('./Server')
const crypto = require('crypto')

const server = new Server(8080)

server.onConnection = client => {

	server.clientsAndPlayerIds.push({
		client: client,
		playerId: crypto.randomUUID().toString(),
	})

	server.sendToClient(client, {
		action: "ON_CONNECTION__PLAYER_ID",
		playerId: server.getPlayerId(client),
	})

	server.sendToClient(client, {
		action: "ON_CONNECTION__PLAYERS_ONLINE",
		players: server.clientsAndPlayerIds
			.filter(x => x.client !== client)
			.map(x => x.playerId),
	})

	server.sendToOthers(client, {
		action: "ON_CONNECTION__PLAYER_CONNECTED",
		playerId: server.getPlayerId(client),
	})
}

server.onClose = client => {
	server.sendToOthers(client, {
		action: 'ON_CLOSE__PLAYER_DISCONNECTED',
		playerId: server.getPlayerId(client),
	})

	server.remove(client)
}

server.on('UPDATE_PLAYER_POSITION', (client, data) => {
	server.sendToOthers(client, {
		action: 'UPDATE_PLAYER_POSITION',
		playerId: server.getPlayerId(client),
		x: data.x,
		y: data.y,
	})
})

server.start()
