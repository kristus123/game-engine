// ClientId(

export class Lobby {
	static {
		SocketClient.onClientMessage("CLIENT_CREATED_LOBBY", data => {
			ActiveLobbies.createLobby(data.lobbyId, data.hostClientId, data.clientIds)
		})
		
		SocketClient.onClientMessage("CLIENT_JOINED_LOBBY", data => {
			ActiveLobbies.joinLobby(data.lobbyId, data.hostClientId, data.originClientId)
		})

		SocketClient.onClientMessage("CLIENT_LEFT_LOBBY", data => {
			ActiveLobbies.leaveLobby(data.lobbyId, data.clientId)
		})

		SocketClient.onClientMessage("UPDATE_LOBBY_FOR_FIRST_TIME", data => {
			data.lobbies.forEach((lobbyId, lobby) => {
				this.lobbies[lobbyId].assign(data.lobbies[lobbyId])
			})
		})

		OtherClients.onJoin(clientId => {
			const lobbies = {}

			ActiveLobbies.lobbies.forEach((lobbyId, lobby) => {
				if (lobby.hostClientId === ClientId) {
					lobbies[lobbyId] = lobby
				}
			})

			SocketClient.sendToClient("UPDATE_LOBBY_FOR_FIRST_TIME", clientId, {
				lobbies: lobbies
			})
		})
	}

	static create() {
		const lobbyId = Random.uuid()
		
		const lobbyObject = ActiveLobbies.createLobby(lobbyId, ClientId, [ClientId])

		SocketClient.sendToOtherClients("CLIENT_CREATED_LOBBY", { ...lobbyObject })

		return lobbyObject
	}

	static join(lobbyId) {
		const lobbyObject = ActiveLobbies.joinLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients("CLIENT_JOINED_LOBBY", { ...lobbyObject })

		return lobbyObject
	}

	static leave(lobbyId) {
		SocketClient.sendToOtherClients("CLIENT_LEFT_LOBBY", {
			lobbyId: lobbyId,
			clientId: ClientId
		})

		ActiveLobbies.removeLobby(lobbyId)
	}
}
