export class Lobby {

	static create() {
		const lobby = LobbyManager.createLobby(Random.uuid(), ClientId)

		SocketClient.sendToOtherClients('CLIENT_CREATED_NEW_LOBBY', {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static join(lobbyId) {
		const lobby = LobbyManager.joinLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients('CLIENT_JOINS_LOBBY', {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static leave(lobbyId) {

		LobbyManager.leaveLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients('CLIENT_LEAVES_LOBBY', {
			lobbyId: lobbyId,
		})
	}

	static get all() {
		return LobbyManager.lobbies
	}

	static onNewLobby(callback) {
		for (const lobby of this.all.values) {
			callback(lobby)
		}

		this.newLobbyListener.listen(callback)
	}

	static {
		this.newLobbyListener = Listener()

		SocketClient.onClientMessage('CLIENT_CREATED_NEW_LOBBY', data => {
			console.log("hey!")
			const lobby = LobbyManager.createLobby(data.lobbyId, data.originClientId)

			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage('CLIENT_JOINS_LOBBY', data => {
			LobbyManager.joinLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage('CLIENT_LEAVES_LOBBY', data => {
			LobbyManager.leaveLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage('SYNC_LOBBY', data => {
			const lobby = LobbyManager.createLobby(data.lobbyId, data.hostClientId)
			for (const c of data.connectedClientIds) {
				lobby.connectedClientIds.add(c)
			}
		})

		OtherClients.onJoin(newClientId => {
			for (const lobby of LobbyManager.myLobbies()) {
				SocketClient.sendToClient('SYNC_LOBBY', newClientId, lobby)
			}
		})
	}

}

