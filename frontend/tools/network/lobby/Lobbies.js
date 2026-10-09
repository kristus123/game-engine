export class Lobbies {

	static lobbies = {}

	static create(lobbyId, hostUserId, userObject={}) {
		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostUserId: hostUserId,
			userIds: [],
			userObjects: {}
		}

		this.lobbies[lobbyId].userObjects.assertKeyNotPresent(hostUserId)

		this.lobbies[lobbyId].userIds.push(hostUserId)
		this.lobbies[lobbyId].userObjects[hostUserId] = userObject

		return this.lobbies[lobbyId]
	}

	static createExistingLobby(lobbyId, hostUserId, userObjects) {
		this.lobbies.assertKeyNotPresent(lobbyId)

		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostUserId: hostUserId,
			userIds: [],
			userObjects: {}
		}

		this.lobbies[lobbyId].userObjects.assertKeyNotPresent(hostUserId)

		userObjects.forEach((userId, object) => {
			this.lobbies[lobbyId].userIds.push(userId)
			this.lobbies[lobbyId].userObjects[userId] = object
		})

		return this.lobbies[lobbyId]
	}

	static join(lobbyId, userId, userObject={}) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].userObjects.assertKeyNotPresent(userId)

		this.lobbies[lobbyId].userIds.push(userId)
		this.lobbies[lobbyId].userObjects[userId] = userObject

		return this.lobbies[lobbyId]
	}

	static leave(lobbyId, userId) {
		this.lobbies.assertKeyPresent(lobbyId)

		this.lobbies[lobbyId].userObjects.assertKeyPresent(userId)

		delete this.lobbies[lobbyId].userObjects[userId]
	}

	static userObject(lobbyId, userId) {
		this.lobbies.assertKeyPresent(lobbyId)
		this.lobbies[lobbyId].userObjects.assertKeyPresent(userId)

		return Lobbies.lobbies[lobbyId].userObjects[userId]
	}

	static get myLobbies() {
		const myLobbyList = []

		for (const lobby of Lobbies.lobbies.values) {
			if (lobby.hostUserId == Token.userId) {
				myLobbyList.push(lobby)
			}
		}

		return myLobbyList
	}
}
