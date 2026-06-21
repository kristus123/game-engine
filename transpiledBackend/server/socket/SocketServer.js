import { SfuServer } from '#root/transpiledBackend/server/rtc/SfuServer.js'; 
import { SimplifiedSocketServerAPI } from '#root/transpiledBackend/server/socket/SimplifiedSocketServerAPI.js'; 
import { SocketServer } from '#root/transpiledBackend/server/socket/SocketServer.js'; 

export const socketServer = new SimplifiedSocketServerAPI()

socketServer.onConnection = (client, clientId) => {
			Assert.notNull(client, 'param 1 - client - SocketServer.null')
			Assert.notNull(clientId, 'param 2 - clientId - SocketServer.null')
	console.log(`${clientId} has connected`)

	socketServer.sendToEveryone({
		action: "UPDATE_CLIENTS_LIST",
		clientIds: socketServer.allClientIds,
		originClientId: clientId
	})
}

socketServer.onClose = (client, clientId) => {
			Assert.notNull(client, 'param 1 - client - SocketServer.null')
			Assert.notNull(clientId, 'param 2 - clientId - SocketServer.null')
	console.log(`${clientId} has disconnected`)

	SfuServer.closeConnectionWithClient(clientId)

	socketServer.sendToEveryone({
		action: "REMOVE_CLIENT",
		clientId: clientId
	})
}

socketServer.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
	console.log(`Server Passing Message: ${JSON.stringify(data)}`)

	const index = socketServer.allClientIds.indexOf(data.targetClientId)
	const targetClient = socketServer.allClients[index]

	socketServer.sendToClient(targetClient, data)
})
