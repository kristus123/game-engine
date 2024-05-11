const fs = require('fs')

const gameObjects = JSON.parse(fs.readFileSync('data.json', 'utf8')).objects.map(o => JSON.parse(o))
const SocketServer = require('./SocketServer')
const { log } = require('console')
const server = new SocketServer(8081)

server.onConnection = (client, clientId) => {

	server.sendToClient(client, {
		action: "GET_GAME_OBJECTS",
		gameObjects: gameObjects,
	})

	for (const g of gameObjects) {
		if(g.handledByClientId == null){
			g.handledByClientId = clientId
			server.sendToEveryone( {
				action: "GET_CLIENT_UPDATE",
				clientid:g.handledByClientId,
				uuid:g.uuid
			});
		}
	}

	
}

server.onClose = (client,clientId) => {
	for (const o of gameObjects) {
		if (o.handledByClientId == clientId) {
			o.handledByClientId = null
		}
	}
	for (const o of gameObjects) {
		if (o.handledByClientId == clientId) {
			o.handledByClientId = server.allClientIds[0]
			server.sendToEveryone({
				action:"GET_CLIENT_UPDATE",
				clientid:o.handledByClientId,
				uuid:o.uuid
			})
		}
	}
}

server.on('UPDATE_OBJECT_POSITION', (client, clientId, data) => {
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
server.on('GET_CLIENT_UPDATE',(client,clientId,data)=>{
	for (const o of gameObjects) {
		if (o.uuid == data.uuid) {
			o.handledByClientId = data.clientid
			server.sendToEveryone({
				action:"GET_CLIENT_UPDATE",
				clientid:o.handledByClientId,
				uuid:o.uuid
			})
			break
		}
	}
})
server.start()
