import SocketServer from '#root/server/socket/SimplifiedSocketServerAPI.js'

export const socketServer = new SocketServer()

socketServer.onConnection = (client, clientId) => {
	console.log(`${clientId} has connected`)

	socketServer.sendToEveryone({
		action: 'UPDATE_CLIENTS_LIST',
		clientIds: socketServer.allClientIds,
		originClientId: clientId
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
		clientId: clientId
	})
}
