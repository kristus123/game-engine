export class OnlineLobbyManager {

	static {

		this.newLobbyListener = Listener()

		SocketClient.onClientMessage("CLIENT_CREATED_NEW_LOBBY", data => {
			const lobby = Lobbies.createLobby(data.lobbyId, data.originClientId)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("CLIENT_JOINS_LOBBY", data => {
			Lobbies.join(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage("CLIENT_LEAVES_LOBBY", data => {
			Lobbies.leave(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage("SYNC_EXISTING_LOBBIES", data => {
			Lobbies.createExistingLobby(data.lobbyId, data.hostClientId, data.clients)
		})

		SocketClient.onClientMessage("UPDATE_LOBBY_CLIENT_OBJECT", data => {
			const o = Lobbies.clientObject(data.lobbyId, data.originClientId)

			o[data.key] = data.value
		})

		OtherClients.onJoin(newClientId => {
			for (const lobby of Lobbies.myLobbies()) {
				SocketClient.sendToClient("SYNC_EXISTING_LOBBIES", newClientId, {
					lobbyId: lobby.lobbyId,
					hostClientId: lobby.hostClientId,
					// this can be renamed to clientIds and only contain ids [c1, c2]
					clients: Object.fromEntries(Object.entries(lobby.clients).map(([id, obj]) => [id, { ...obj }]))
				})
			}
		})
	}

	static onNewLobby(callback) {
		for (const lobby of Lobbies.lobbies.values) {
			callback(lobby)
		}

		this.newLobbyListener.listen(callback)
	}

	static updateLobbyObjectField(lobbyId, key, value) {
		SocketClient.sendToOtherClients("UPDATE_LOBBY_CLIENT_OBJECT", {
			lobbyId: lobbyId,
			key: key,
			value: value,
		})
	}

	static notifyClientCreatedNewLobby(lobbyId) {
		SocketClient.sendToOtherClients("CLIENT_CREATED_NEW_LOBBY", {
			lobbyId: lobbyId,
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
