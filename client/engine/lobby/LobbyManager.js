export class LobbyManager {

	static lobbies = {}

	static createLobby(lobbyId, hostClientId) {

		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clients: {
				[hostClientId]: { objectData: 0 }
			},
		}

		return this.lobbies[lobbyId]
	}

	static joinLobby(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)
		
		this.lobbies[lobbyId].clients.assertKeyNotPresent(clientId)
		
		this.lobbies[lobbyId].clients[clientId] = { objectData: 0 }
		
		return this.lobbies[lobbyId]
	}


	static leaveLobby(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].connectedClientIds.assertKeyPresent(clientId)

		delete this.lobbies[lobbyId].clients[clientId]
	}

	static* myLobbies() {
    	for (const [lobbyId, lobby] of Object.entries(this.lobbies)) {
        	if (lobby.hostClientId === ClientId) {
            	yield lobbyId
        	}
    	}
	}
}
