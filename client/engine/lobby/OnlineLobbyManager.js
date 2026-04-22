export class OnlineLobbyManager {
	static {

		this.newLobbyListener = Listener()

		SocketClient.onClientMessage("CLIENT_CREATED_NEW_LOBBY", data => {
			const lobby = Lobbies.createExistingLobby(data.lobbyId, data.originClientId, data.clientObjects)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("CLIENT_JOINS_LOBBY", data => {
			Lobbies.join(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage("CLIENT_LEAVES_LOBBY", data => {
			Lobbies.leave(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage("SYNC_EXISTING_LOBBIES", data => {
			const lobby = Lobbies.createExistingLobby(data.lobbyId, data.hostClientId, data.clientObjects)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("UPDATE_LOBBY_CLIENT_OBJECT", data => {
			const clientObject = Lobbies.clientObject(data.lobbyId, data.originClientId)

			clientObject[data.key] = data.value
		})

		OtherClients.onJoin(newClientId => {
			for (const lobby of Lobbies.myLobbies) {
				SocketClient.sendToClient("SYNC_EXISTING_LOBBIES", newClientId, {
					lobbyId: lobby.lobbyId,
					hostClientId: lobby.hostClientId,
					clientIds: lobby.clientIds,
					clientObjects: Object.fromEntries(Object.entries(lobby.clientObjects).map(([clientId, clientObject]) => [clientId, { ...clientObject }]))
				})
			}
		})
	}

	static onNewLobby(callback) {
		this.newLobbyListener.listen(callback)
	}

	static updateLobbyObjectField(lobbyId, key, value) {
		SocketClient.sendToOtherClients("UPDATE_LOBBY_CLIENT_OBJECT", {
			lobbyId: lobbyId,
			key: key,
			value: value,
		})
	}

	static notifyClientCreatedNewLobby(lobby) {
		SocketClient.sendToOtherClients("CLIENT_CREATED_NEW_LOBBY", {
			lobbyId: lobby.lobbyId,
			clientObjects: Object.fromEntries(
				Object.entries(lobby.clientObjects).map(([id, obj]) => [id, { ...obj }])
			)
		})
	}

	static notifyClientJoinsLobby(lobbyId) {
		SocketClient.sendToOtherClients("CLIENT_JOINS_LOBBY", {
			lobbyId: lobbyId,
		})
	}

	static notifyClientLeavesLobby(lobbyId) {
		SocketClient.sendToOtherClients("CLIENT_LEAVES_LOBBY", {
			lobbyId: lobbyId,
		})

	}
}