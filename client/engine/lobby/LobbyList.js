export class LobbyList {

	static lobbies = {}

	static createLobby(lobbyId, hostClientId) {
		this.lobbies.assertKeyNotPresent(data.lobbyId)

		this.lobbies[data.lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			connectedClientIds: []
		}

		return this.lobbies[data.lobbyId]
	}

	static joinLobby(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].connectedClientIds.assertKeyNotPresent(clientId)

		this.lobbies[lobbyId].connectedClientIds.add(clientId)

		return this.lobbies[lobbyId]
	}


	static leaveLobby(lobbyId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].connectedClientIds.assertKeyPresent(clientId)

		this.lobbies[lobbyId].connectedClientIds.remove(clientId)
	}

}
