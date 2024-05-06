// const fs = require('fs');
// const world = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const Server = require('./Server')
const crypto = require('crypto')

const server = new Server(8080)


const playerIdFor = {}

server.onConnection = client => {
	playerIdFor[client] = crypto.randomUUID().toString()

	server.clientsAndPlayerIds.push({
		client: client,
		playerId: playerIdFor[client],
	})

	server.sendToClient(client, {
		action: "ON_CONNECTION__PLAYER_ID",
		playerId: playerIdFor[client],
	})



	// const x = 
	// console.log(x)

	server.sendToClient(client, {
		action: "ON_CONNECTION__PLAYERS_ONLINE",
		players: Object.entries(playerIdFor)
			.map(([client, playerId]) => playerId),
	})

	server.sendToOthers(client, {
		action: "ON_CONNECTION__PLAYER_CONNECTED",
		playerId: playerIdFor[client],
	})
}

server.onClose = client => {
	server.sendToOthers(client, {
		action: 'ON_CLOSE__PLAYER_DISCONNECTED',
		playerId: playerIdFor[client],
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
