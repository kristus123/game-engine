const SocketServer = require('./SocketServer')

module.exports = class {
	constructor(port) {
		this.socket = new SocketServer(port)
		
		this.socket.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
			console.log(`Server Passing Message: ${JSON.stringify(data)}`)

			this.index = this.socket.allClientIds.indexOf(data.targetClientId)
			this.targetClient = this.socket.allClients[this.index]
		
			this.socket.sendToClient(this.targetClient, data);
		})
	}
	start() {
		this.socket.start()
	}
}
