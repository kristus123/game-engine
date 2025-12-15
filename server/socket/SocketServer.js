const SocketServer = require('./SimplifiedSocketServerAPI')

const socket = new SocketServer(8082)

socket.start()

socket.onConnection = (client, clientId) => {
	console.log(`${clientId} has connected`)

	socket.sendToEveryone({
		action: "UPDATE_CLIENTS_LIST",
		clientIds: socket.allClientIds
	})
}

socket.on("CREATE_LOBBY", (client, clientId, data) => {
	console.log("Creating Lobby...")
})

socket.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
	console.log(`Server Passing Message: ${JSON.stringify(data)}`)

	const index = socket.allClientIds.indexOf(data.targetClientId)
	const targetClient = socket.allClients[index]
		
	socket.sendToClient(targetClient, data);
})

socket.onClose = (client, clientId) => {
	console.log(`${clientId} has disconnected`)

	socket.sendToEveryone({
		action: "REMOVE_CLIENT",
		clientId: socket.clientId
	})
}

module.exports = socket
