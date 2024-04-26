const Server = require("./Server")

const server  = new Server()

server.onConnection = client => {
	
}

server.onClose = client => {
	
}

server.on("UPDATE_PLAYER_POSITION", (client, data) => {
	server.send(client, {
		x: data.x,
		y: data.y,
	})
})

server.start()
