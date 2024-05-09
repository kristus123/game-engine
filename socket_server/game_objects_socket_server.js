const fs = require('fs');

const gameObjects = JSON.parse(fs.readFileSync('data.json', 'utf8')).objects.map(o => JSON.parse(o))
const SocketServer = require('./SocketServer')
const s = new SocketServer(8081)

s.onConnection = (client, clientId) => {

	s.sendToClient(client, {
		action: "GET_GAME_OBJECTS",
		gameObjects: gameObjects,
	})

	for (const o of gameObjects) {
		if (o.handledByClientId == null) {
			o.handledByClientId = clientId
		}
	}
}

s.onClose = (client, clientId) => {
	for (const o of gameObjects) {
		if (o.handledByClientId == clientId) {
			o.handledByClientId = null
		}
	}

	for (const o of gameObjects) {
		if (o.handledByClientId == null) {
			o.handledByClientId = s.allClientIds[0]
		}
	}


}

s.on('UPDATE_OBJECT_POSITION', (client, clientId, data) => {
	for (const o of gameObjects) {
		if (o.uuid == data.uuid) {
			o.position.x = data.x
			o.position.y = data.y

			s.sendToOthers(client, {
				action: 'UPDATE_OBJECT_POSITION',
				uuid: data.uuid,
				x: data.x,
				y: data.y,
			})

			break
		}
	}
})

s.start()
