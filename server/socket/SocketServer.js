const SocketServer = require('./SimplifiedSocketServerAPI')

const socketServer = new SocketServer(8082)

socketServer.onConnection = (client, clientId) => {
	console.log(`${clientId} has connected`)

	socketServer.sendToEveryone({
		action: 'UPDATE_CLIENTS_LIST',
		clientIds: socketServer.allClientIds
	})
}

socketServer.on('CLIENT_TO_CLIENT', (client, clientId, data) => {
	console.log(`Server Passing Message: ${JSON.stringify(data)}`)

	const index = socketServer.allClientIds.indexOf(data.targetClientId)
	const targetClient = socketServer.allClients[index]

	socketServer.sendToClient(targetClient, data)
})

socketServer.onClose = (client, clientId) => {
	console.log(`${clientId} has disconnected`)

	socketServer.sendToEveryone({
		action: 'REMOVE_CLIENT',
		clientId: socketServer.clientId
	})
}

socketServer.start()
