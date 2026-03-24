// ClientId(

export class ActiveLobbies {
	static {
		this.lobbies = {}

		SocketClient.onClientMessage("UPDATE_LOBBY_LIST_FOR_FIRST_TIME", data => {
			if (data.lobbies.notEmpty()) {
				for (const lobbyId in data.lobbies) {
					this.lobbies[lobbyId] = data.lobbies[lobbyId]
				}
			}
		})

		OtherClients.onJoin(clientId => {
			const lobbyList = {}

			for (const lobbyId in this.lobbies) {
				const lobby = this.lobbies[lobbyId]

				if (lobby.hostClientId === ClientId) {
					lobbyList[lobbyId] = this.lobbies[lobbyId]
				}
			}

			SocketClient.sendToClient("UPDATE_LOBBY_LIST_FOR_FIRST_TIME", clientId, {
				lobbies: lobbyList
			})
		})
	}

	static createLobby(lobbyId, hostClientId, clientIds) {
		this.lobbies[lobbyId] = {
			lobbyId: lobbyId,
			hostClientId: hostClientId,
			clientIds: clientIds
		}

		return this.lobbies[lobbyId]
	}

	static joinLobby(lobbyId, hostClientId, clientId) {
		const lobby = this.lobbies[lobbyId]

		if (lobby && !lobby.clientIds.includes(clientId)) {
			this.lobbies[lobbyId].clientIds.push(clientId)
		} else {
			ActiveLobbies.createLobby(lobbyId, hostClientId, [hostClientId])
			this.lobbies[lobbyId].clientIds.push(clientId)
		}

		return this.lobbies[lobbyId]
	}

	static leaveLobby(lobbyId, clientId) {
		const indexOfClient = this.lobbies[lobbyId].clientIds.indexOf(clientId)
		this.lobbies[lobbyId].clientIds.splice(indexOfClient, 1)
	}

	static removeLobby(lobbyId) {
		delete this.lobbies[lobbyId]
	}
}
