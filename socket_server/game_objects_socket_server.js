const fs = require('fs');
const gameObjects = JSON.parse(fs.readFileSync('data.json', 'utf8')).objects.map(o => JSON.parse(o))

const Server = require('./Server')
const server = new Server(8081)

server.onConnection = client => {
	server.sendToClient(client, {
		action: "ON_CONNECTION__GET_GAME_OBJECTS",
		gameObjects: gameObjects,
	})
}

server.onClose = client => {
	console.log("bye")
}

server.on('UPDATE_OBJECT_POSITION', (client, data) => {

	for (const o of gameObjects) {
		if (o.uuid == data.uuid) {
			o.position.x = data.x
			o.position.y = data.y
			break
		}
	}

	server.sendToOthers(client, {
		action: 'UPDATE_OBJECT_POSITION',
		uuid: data.uuid,
		x: data.x,
		y: data.y,
	})
})

server.start()
