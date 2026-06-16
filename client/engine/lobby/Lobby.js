
export class Lobby {

	static create() {
		const lobbyId = Random.uuid()

		const clientObject = ProxyObject((key, value) => {
			OnlineLobbyManager.updateLobbyObjectField(lobbyId, key, value)
		})

		const lobby = Lobbies.create(lobbyId, My.clientId, clientObject)

		OnlineLobbyManager.notifyClientCreatedNewLobby(lobby)

		return lobby
	}

	static join(lobbyId) {
		const clientObject = ProxyObject((key, value) => {
			OnlineLobbyManager.updateLobbyObjectField(lobbyId, key, value)
		})

		const lobby = Lobbies.join(lobbyId, My.clientId, clientObject)

		OnlineLobbyManager.notifyClientJoinsLobby(lobby.lobbyId)

		return lobby
	}

	static leave(lobbyId) {
		Lobbies.leave(lobbyId, My.clientId)

		OnlineLobbyManager.notifyClientLeavesLobby(lobbyId)
	}

	static onNewLobby(callback) {
		OnlineLobbyManager.onNewLobby(callback)
	}

}