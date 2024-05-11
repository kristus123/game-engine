const fs = require('fs')

const gameObjects = JSON.parse(fs.readFileSync('data.json', 'utf8')).objects.map(o => JSON.parse(o))
const SocketServer = require('./SocketServer')
const s = new SocketServer(8081)

s.onConnection = (client, clientId) => {

	server.sendToClient(client, {
		action: "ON_CONNECTION__GET_GAME_OBJECTS",
		gameObjects: gameObjects,
	})

	for (const g of gameObjects) {
		if (g.handledBy == null) {
			g.handledBy = client
			gameObjectsHandledBy[client].push(g)
		}
	}

	server.sendToClient(client, {
		action: "ON_CONNECTION__GET_GAME_OBJECTS_HANDLED_BY_YOU",
		gameObjects: gameObjectsHandledBy[client],
	})
}

server.onClose = client => {

	for (const o of gameObjects) {
		if (o.handledByClientId == clientId) {
			o.handledByClientId = null
		}
	}

	for (const o of gameObjects) {
		if (o.handledByClientId == null) {
			o.handledByClientId = s.allClientIds[0]
			s.sendToOthers(client,{
				action:"GET_CLINET_UPDATE",
				clientid:o.handledByClientId,
				uuid:o.uuid
			})
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
s.on('GET_CLINET_UPDATE',(client,clientId,data)=>{
	for (const o of gameObjects) {
		if (o.uuid == data.uuid) {
			o.handledByClientId = data.clientid
			s.sendToOthers(client,{
				action:"GET_CLINET_UPDATE",
				clientid:o.handledByClientId,
				uuid:o.uuid
			})
			s.sendToClient(client,{
				action:"GET_CLINET_UPDATE",
				clientid:o.handledByClientId,
				uuid:o.uuid
			})
			break
		}
	}
})
s.start()
