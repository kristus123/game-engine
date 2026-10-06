export class OnlineLobbyManager {
	static {

		this.newLobbyListener = Listener()

		SocketClient.onClientMessage("CLIENT_CREATED_NEW_LOBBY", ({ data, metaHeaders }) => {
			const lobby = Lobbies.createExistingLobby(data.lobbyId, metaHeaders.originClientId, data.clientObjects)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("CLIENT_JOINS_LOBBY", ({ data, metaHeaders }) => {
			Lobbies.join(data.lobbyId, metaHeaders.originClientId)
		})

		SocketClient.onClientMessage("CLIENT_LEAVES_LOBBY", ({ data, metaHeaders }) => {
			Lobbies.leave(data.lobbyId, metaHeaders.originClientId)
		})

		SocketClient.onClientMessage("SYNC_EXISTING_LOBBIES", ({ data }) => {
			const lobby = Lobbies.createExistingLobby(data.lobbyId, data.hostClientId, data.clientObjects)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("UPDATE_LOBBY_CLIENT_OBJECT", ({ data, metaHeaders }) => {
			const clientObject = Lobbies.clientObject(data.lobbyId, metaHeaders.originClientId)

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
