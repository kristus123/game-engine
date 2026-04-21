export class Lobbies {

	static lobbies = {}

	static create(lobbyId, hostClientId, clientObject={}) {
		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clientIds: [],
			clientObjects: {}
		}

		this.lobbies[lobbyId].clientObjects.assertKeyNotPresent(hostClientId)

		this.lobbies[lobbyId].clientIds.push(hostClientId)
		this.lobbies[lobbyId].clientObjects[hostClientId] = clientObject

		return this.lobbies[lobbyId]
	}

	static createExistingLobby(lobbyId, hostClientId, clientObjects) {
		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clientIds: [],
			clientObjects: {}
		}

		this.lobbies[lobbyId].clientObjects.assertKeyNotPresent(hostClientId)

		clientObjects.forEach((clientId, object) => {
			this.lobbies[lobbyId].clientIds.push(clientId)
			this.lobbies[lobbyId].clientObjects[clientId] = object
		})

		return this.lobbies[lobbyId]
	}

	static join(lobbyId, clientId, clientObject={}) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].clientObjects.assertKeyNotPresent(clientId)

		this.lobbies[lobbyId].clientIds.push(clientId)
		this.lobbies[lobbyId].clientObjects[clientId] = clientObject

		return this.lobbies[lobbyId]
	}

	static leave(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].clientObjects.assertKeyPresent(clientId)

		delete this.lobbies[lobbyId].clientObjects[clientId]
	}

	static clientObject(lobbyId, clientId) {
		this.lobbies.assertKeyPresent(lobbyId)
		this.lobbies[lobbyId].clientObjects.assertKeyPresent(clientId)

		return Lobbies.lobbies[lobbyId].clientObjects[clientId]
	}

	static get myLobbies() {
		const myLobbyList = []

		for (const lobby of Lobbies.lobbies.values) {
			if (lobby.hostClientId == ClientId) {
				myLobbyList.push(lobby)
			}
		}

		return myLobbyList
	}
}