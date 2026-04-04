export class Lobby {

	static create() {
		const lobby = LobbyManager.createLobby(Random.uuid(), ClientId)

		SocketClient.sendToOtherClients("CLIENT_CREATED_NEW_LOBBY", {
			lobbyId: lobby.lobbyId,
		})

		this.newLobbyListener.trigger(lobby)

		return lobby
	}

	static join(lobbyId) {
		const lobby = LobbyManager.joinLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients("CLIENT_JOINS_LOBBY", {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static leave(lobbyId) {

		LobbyManager.leaveLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients("CLIENT_LEAVES_LOBBY", {
			lobbyId: lobbyId,
		})
	}

	static {
		this.newLobbyListener = Listener()

		SocketClient.onClientMessage("CLIENT_CREATED_NEW_LOBBY", data => {
			const lobby = LobbyManager.createLobby(data.lobbyId, data.originClientId)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("CLIENT_JOINS_LOBBY", data => {
			LobbyManager.joinLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage("CLIENT_LEAVES_LOBBY", data => {
			LobbyManager.leaveLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage("SYNC_LOBBY", data => {
			const lobby = LobbyManager.createLobby(data.lobbyId, data.hostClientId)
			data.clients.forEach((c, o) => {
				lobby.clients[c] = o
			})
		})

		SocketClient.onClientMessage("UPDATE_CLIENT_OBJECT", data => {
			LobbyManager.lobbies[data.lobbyId].clients[data.originClientId][data.key] = data.value
		})

		OtherClients.onJoin(newClientId => {
			for (const lobby of LobbyManager.myLobbies()) {
				const clients = {}

				lobby.clients.forEach((clientId, clientData) => {
					clients[clientId] = { ...clientData }
				})

				SocketClient.sendToClient("SYNC_LOBBY", newClientId, {
					lobbyId: lobby.lobbyId,
					hostClientId: lobby.hostClientId,
					clients
				})
			}
		})
	}

	static onNewLobby(callback) {
		for (const lobby of LobbyManager.lobbies.values) {
			callback(lobby)
		}

		this.newLobbyListener.listen(callback)
	}

}
