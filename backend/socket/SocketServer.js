export const SocketServer = new SimpleSocketServer() // Okay, we should fix this here. This is wonky

SocketServer.onConnection = (client, clientId) => {
	console.log(`${clientId} has connected`)

	SocketServer.sendToEveryone({
		action: "UPDATE_CLIENTS_LIST",
		clientIds: SocketServer.allClientIds,
		originClientId: clientId
	})
}

SocketServer.onClose = (client, clientId) => {
	console.log(`${clientId} has disconnected`)

	SfuServer.closeConnectionWithClient(clientId)

	SocketServer.sendToEveryone({
		action: "REMOVE_CLIENT",
		clientId: clientId,
	})
}

SocketServer.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
	console.log(`Server Passing Message: ${JSON.stringify(data)}`)

	const index = SocketServer.allClientIds.indexOf(data.targetClientId)
	const targetClient = SocketServer.allClients[index]

	SocketServer.sendToClient(targetClient, data)
})
