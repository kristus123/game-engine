export class LobbyManager {

	static lobbies = {}

	static createLobby(lobbyId, hostClientId) {

		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			connectedClientIds: [hostClientId],
			connectedObjects: {
				[hostClientId]: {objectData: "test"}
			}
		}

		return this.lobbies[lobbyId]
	}

	static joinLobby(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].connectedClientIds.assertKeyNotPresent(clientId)

		this.lobbies[lobbyId].connectedClientIds.add(clientId)

		this.lobbies[lobbyId].connectedObjects[clientId] = {objectData: "test"}
		
		return this.lobbies[lobbyId]
	}


	static leaveLobby(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].connectedClientIds.assertKeyPresent(clientId)

		this.lobbies[lobbyId].connectedClientIds.remove(clientId)
		
		delete this.lobbies[lobbyId].connectedObjects[clientId]
	}

	static* myLobbies() {
		for (const lobby of this.lobbies.values) {
			if (lobby.hostClientId == ClientId) {
				yield lobby
			}
		}
	}
}
