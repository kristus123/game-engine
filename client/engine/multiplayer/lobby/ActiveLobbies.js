// ClientId(

export class ActiveLobbies {
	static {
		this.lobbies = {}
	}

	static createLobby(lobbyId, hostClientId, clientIds) {
		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clientIds: clientIds
		}

		return this.lobbies[lobbyId]
	}

	static joinLobby(lobbyId, clientId) {
		if (this.lobbies[lobbyId]) {
			this.lobbies[lobbyId].clientIds.addIfMissing(clientId)
		}

		return this.lobbies[lobbyId]
	}

	static leaveLobby(lobbyId, clientId) {
		this.lobbies[lobbyId].clientIds.remove(clientId)
	}

	static removeLobby(lobbyId) {
		delete this.lobbies[lobbyId]
	}
}
