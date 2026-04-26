import SimplifiedSocketServerAPI from "#root/server/socket/SimplifiedSocketServerAPI.js"
import { SfuServer } from "#root/server/webrtc/SfuServer.js"

export const socketServer = new SimplifiedSocketServerAPI()

socketServer.onConnection = (client, clientId) => {
	console.log(`${clientId} has connected`)
	SfuServer.connectWithClient(client, clientId)


	socketServer.sendToEveryone({
		action: "UPDATE_CLIENTS_LIST",
		clientIds: socketServer.allClientIds,
		originClientId: clientId
	})
}

socketServer.onClose = (client, clientId) => {
	console.log(`${clientId} has disconnected`)
	SfuServer.closeConnectionWithClient(client, clientId)

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
