export class LobbyManager {

	static lobbies = {}

	static createLobby(lobbyId, hostClientId, onUpdate) {

		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clients: {}
		}

		if (hostClientId === ClientId) {
			this.lobbies[lobbyId].clients[hostClientId] = ProxyObject((prop, value) => onUpdate(lobbyId, prop, value))
		} else {
			this.lobbies[lobbyId].clients[hostClientId] = {}
		}
		
		return this.lobbies[lobbyId]
	}

	static joinLobby(lobbyId, clientId, onUpdate) {
		this.lobbies.assertKeyPresent(lobbyId)
		
		this.lobbies[lobbyId].clients.assertKeyNotPresent(clientId)

		if (clientId === ClientId) {
    		this.lobbies[lobbyId].clients[clientId] = ProxyObject((prop, value) => onUpdate(lobbyId, prop, value))
		} else {
			this.lobbies[lobbyId].clients[clientId] = {}
		}

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
