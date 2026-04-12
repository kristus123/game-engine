export class Lobbies {

	static lobbies = {}

	static create(lobbyId, hostClientId, lobbyObject={}) {
		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clients: {},
		}

		this.lobbies[lobbyId].clients.assertKeyNotPresent(hostClientId)
		this.lobbies[lobbyId].clients[hostClientId] = lobbyObject

		return this.lobbies[lobbyId]
	}

	static createExistingLobby(lobbyId, hostClientId, clients) {
		const lobby = Lobbies.create(lobbyId, hostClientId) 
		
		clients.forEach((c, o) => {
			lobby.clients[c] = o
		})
	}

	static join(lobbyId, clientId, lobbyObject={}) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].clients.assertKeyNotPresent(clientId)

		this.lobbies[lobbyId].clients[clientId] = lobbyObject

		return this.lobbies[lobbyId]
	}

	static leave(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].connectedClientIds.assertKeyPresent(clientId)

		delete this.lobbies[lobbyId].clients[clientId]
	}

	static clientObject(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)
		this.lobbies[lobbyId].connectedClientIds.assertKeyPresent(clientId)

		return Lobbies.lobbies[data.lobbyId].clients[data.originClientId]
	}

}
