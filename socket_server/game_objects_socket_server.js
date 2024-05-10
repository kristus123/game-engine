const fs = require('fs')

const gameObjects = JSON.parse(fs.readFileSync('data.json', 'utf8')).objects.map(o => JSON.parse(o))
const gameObjectsHandledBy = {}

const Server = require('./SocketServer')
const server = new Server(8081)

const uuidFor = {}

server.onConnection = client => {

	uuidFor[client] = crypto.randomUUID().toString()

	server.clientsAndPlayerIds.push({
		client: client,
		playerId: uuidFor[client],
	})

	gameObjectsHandledBy[client] = []

	server.sendToClient(client, {
		action: 'ON_CONNECTION__GET_GAME_OBJECTS',
		gameObjects: gameObjects,
	})

	for (const g of gameObjects) {
		if (g.handledBy == null) {
			g.handledBy = client
			gameObjectsHandledBy[client].push(g)
		}
	}

	server.sendToClient(client, {
		action: 'ON_CONNECTION__GET_GAME_OBJECTS_HANDLED_BY_YOU',
		gameObjects: gameObjectsHandledBy[client],
	})
}

server.onClose = client => {

	for (const g of gameObjectsHandledBy[client]) {
		g.handledBy = null
	}

	delete gameObjectsHandledBy[client]
}

server.on('UPDATE_OBJECT_POSITION', (client, data) => {
	console.log(data)

	for (const o of gameObjects) {
		if (o.uuid == data.uuid) {
			o.position.x = data.x
			o.position.y = data.y

			server.sendToOthers(client, {
				action: 'UPDATE_OBJECT_POSITION',
				uuid: data.uuid,
				x: data.x,
				y: data.y,
			})

			break
		}
	}
})

server.start()
