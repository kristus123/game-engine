const SocketServer = require('./SocketServer')

module.exports = class {
	constructor(port) {
		this.socket = new SocketServer(port)
		
		this.socket.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
			console.log(`Server Passing Message: ${JSON.stringify(data)}`)
			this.socket.sendToEveryone(data);
		})
	}
	start() {
		this.socket.start()
	}
}
