import SocketServer from "#root/server/socket/SimplifiedSocketServerAPI.js"
import RandomId from "#root/dev/build_tools/RandomId.js"

export const socketServer = new SocketServer()

const activeLobbies = {}

socketServer.onConnection = (client, clientId) => {
	console.log(`${clientId} has connected`)

	socketServer.sendToEveryone({
		action: "UPDATE_CLIENTS_LIST",
		clientIds: socketServer.allClientIds,
		originClientId: clientId
	})
}

socketServer.on("CLIENT_TO_CLIENT", (client, clientId, data) => {
	console.log(`Server Passing Message: ${JSON.stringify(data)}`)

	const index = socketServer.allClientIds.indexOf(data.targetClientId)
	const targetClient = socketServer.allClients[index]

	socketServer.sendToClient(targetClient, data)
})

socketServer.onClose = (client, clientId) => {
	console.log(`${clientId} has disconnected`)

	socketServer.sendToEveryone({
		action: "REMOVE_CLIENT",
		clientId: clientId
	})
}

socketServer.on("CREATE_LOBBY", (client, clientId, data) => {
	const newLobby = {
		lobbyId: data.lobbyId,
		adminId: clientId,
		clients: [clientId]
	}

	activeLobbies[newLobby.lobbyId] = {
		adminId: newLobby.adminId,
		clients: newLobby.clients
	}

	socketServer.sendToEveryone({
		action: "SYNC_LOBBY",
		...newLobby
	})
})

socketServer.on("JOIN_LOBBY", (client, clientId, data) => {
	if (Object.hasOwn(activeLobbies, data.lobbyId)) {
		const targetLobby = activeLobbies[data.lobbyId]
		targetLobby.clients.push(clientId)
		
		socketServer.sendToEveryone({
			action: "SYNC_LOBBY",
			lobbyId: data.lobbyId,
			adminId: targetLobby.adminId,
			clients: targetLobby.clients
		})
	}
})

socketServer.on("LEAVE_LOBBY", (client, clientId, data) => {
	if (Object.hasOwn(activeLobbies, data.lobbyId)) {
		const targetLobby = activeLobbies[lobbyId]
		const indexOfClient = targetLobby.clients.indexOf(clientId)
		targetLobby.clients.splice(indexOfClient)
		
		socketServer.sendToEveryone({
			action: "SYNC_LOBBY",
			lobbyId: data.lobbyId,
			adminId: targetLobby.adminId,
			clients: targetLobby.clients
		})
	}
})