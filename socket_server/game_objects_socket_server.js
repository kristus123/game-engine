const fs = require('fs')

const gameObjects = JSON.parse(fs.readFileSync('persisted-objects/chickens.json', 'utf8'))
const SocketServer = require('./SocketServer')

const List = require('./List')

const server = new SocketServer(8081)

server.onConnection = (client, clientId) => {

	server.sendToClient(client, {
		action: 'GET_GAME_OBJECTS',
		gameObjects: gameObjects,
	})

	for (const g of gameObjects) {
		if (g.handledByClientId == null) {
			g.handledByClientId = clientId
			server.sendToEveryone({
				action: 'OBJECT_HANDLED_BY',
				clientid: g.handledByClientId,
				objectId: g.objectId
			})
		}
	}
}

server.onClose = (client, clientId) => {
	for (const o of gameObjects) {
		if (o.handledByClientId == clientId) {
			o.handledByClientId = null
		}
	}

	for (const o of gameObjects) {
		if (o.handledByClientId == clientId) {
			o.handledByClientId = server.allClientIds[0]
			server.sendToEveryone({
				action: 'OBJECT_HANDLED_BY',
				clientid: o.handledByClientId,
				objectId: o.objectId
			})
		}
	}
}

server.on('UPDATE_OBJECT_POSITION', (client, clientId, data) => {
	for (const o of gameObjects) {
		if (o.objectId == data.objectId) {
			o.position.x = data.x
			o.position.y = data.y

			server.sendToOthers(client, {
				action: 'UPDATE_OBJECT_POSITION',
				objectId: data.objectId,
				x: data.x,
				y: data.y,
			})

			break
		}
	}
})

server.on('REMOVE_OBJECT', (client, clientId, data) => {
	for (const o of gameObjects) {
		if (o.objectId == data.objectId) {
			server.sendToEveryone({
				action: 'REMOVE_OBJECT',
				objectId: data.objectId,
			})

			List.remove(gameObjects, o)

			break
		}
	}
})

server.on('OBJECT_HANDLED_BY', (client, clientId, data) => {
	for (const o of gameObjects) {
		if (o.objectId == data.objectId) {
			o.handledByClientId = data.clientid
			server.sendToEveryone({
				action: 'OBJECT_HANDLED_BY',
				clientid: o.handledByClientId,
				objectId: o.objectId
			})

			break
		}
	}
})

server.start()
