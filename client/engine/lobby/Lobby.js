export class Lobby {

	static create() {

		const lobbyObject = ProxyObject((key, value) => {
			OnlineLobbyManager.updateLobbyObjectField(lobby.lobbyId, key, value)
		})

		const lobby = Lobbies.create(Random.uuid(), ClientId, lobbyObject)


		OnlineLobbyManager.notifyClientCreatedNewLobby(lobby.lobbyId)

		return lobby
	}

	static join(lobbyId) {

		const lobbyObject = ProxyObject((key, value) => {
			OnlineLobbyManager.updateLobbyObjectField(lobby.lobbyId, key, value)
		})

		const lobby = Lobbies.join(lobbyId, ClientId, lobbyObject)

		OnlineLobbyManager.notifyClientJoinsLobby(lobby.lobbyId)

		return lobby
	}

	static leave(lobbyId) {
		Lobbies.leave(lobbyId, ClientId)

		OnlineLobbyManager.notifyClientLeavesLobby(lobby.lobbyId)
	}

	static onNewLobby(callback) {
		OnlineLobbyManager.onNewLobby(callback)
	}

}
