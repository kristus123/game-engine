export class LobbyManager {

	static lobbies = {}

	static createLobby(lobbyId, hostClientId, onUpdate) {

		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clients: {}
		}

		this.lobbies[lobbyId].clients[hostClientId] = (hostClientId === ClientId) ? ProxyObject((prop, value) => onUpdate(lobbyId, prop, value)) : {}
		
		return this.lobbies[lobbyId]
	}

	static joinLobby(lobbyId, clientId, onUpdate) {
		this.lobbies.assertKeyPresent(lobbyId)
		
		this.lobbies[lobbyId].clients.assertKeyNotPresent(clientId)

    	this.lobbies[lobbyId].clients[clientId] = (clientId === ClientId) ? ProxyObject((prop, value) => onUpdate(lobbyId, prop, value)) : {}

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
