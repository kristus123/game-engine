export class Lobby {

	static create() {
		const lobbyId = Random.uuid()

		const userObject = ProxyObject((key, value) => {
			OnlineLobbyManager.updateLobbyObjectField(lobbyId, key, value)
		})

		const lobby = Lobbies.create(lobbyId, Token.userId, userObject)

		OnlineLobbyManager.notifyClientCreatedNewLobby(lobby)

		return lobby
	}

	static join(lobbyId) {
		const userObject = ProxyObject((key, value) => {
			OnlineLobbyManager.updateLobbyObjectField(lobbyId, key, value)
		})

		const lobby = Lobbies.join(lobbyId, Token.userId, userObject)

		OnlineLobbyManager.notifyClientJoinsLobby(lobby.lobbyId)

		return lobby
	}

	static leave(lobbyId) {
		Lobbies.leave(lobbyId, Token.userId)

		OnlineLobbyManager.notifyClientLeavesLobby(lobbyId)
	}

	static onNewLobby(callback) {
		OnlineLobbyManager.onNewLobby(callback)
	}

}
