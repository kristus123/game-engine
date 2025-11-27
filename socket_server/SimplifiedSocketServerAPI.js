const SocketServer = require('./SocketServer')

module.exports = class {
	constructor(port) {
		this.socket = new SocketServer(port)
		
	}
	
	sendToOthers(from, data) {
		for (const client of this.socket.allClients) {
			if (client !== from) {
				client.send(JSON.stringify(data))
			}
		}
	}

	sendToEveryone(data) {
		for (const client of this.socket.allClients) {
			client.send(JSON.stringify(data))
		}
	}
	
	sendToClient(client, data) {
		client.send(JSON.stringify(data))
	}

	on(action, callback) {
		this.socket.on(action, callback)
	}
	
	start() {
		this.socket.start()
	}
}
