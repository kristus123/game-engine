export class Lobby {

	static create() {
		const lobbyId = Random.uuid()

		const lobby =  LobbyList.createLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients('NEW_LOBBY_CREATED', {
			lobbyId: lobbyId,
			hostClientId: ClientId,
		})

		return lobby
	}

	static join(lobbyId) {
		const lobby = LobbyList.joinLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients('CLIENT_JOINS_LOBBY', {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static leave(lobbyId) {

		LobbyList.leaveLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients('CLIENT_LEAVES_LOBBY', {
			lobbyId: lobbyId,
		})
	}

	static {
		SocketClient.onClientMessage('NEW_LOBBY_CREATED', data => {
			LobbyList.createLobby(data.lobbyId, data.hostClientId)
		})

		SocketClient.onClientMessage('CLIENT_JOINS_LOBBY', data => {
			LobbyList.joinLobby(data.lobbyId, data.hostClientId)
		})

		SocketClient.onClientMessage('CLIENT_LEAVES_LOBBY', data => {
			LobbyList.leaveLobby(data.lobbyId)
		})

		SocketClient.onClientMessage('FIRST_TIME_SYNC_LOBBY', data => {
			this.lobbies[data.lobbyId] = {
				lobbyId: data.lobbyId,
				hostClientId: data.hostClientId,
				connectedClientIds: data.connectedClientIds
			}
		})

		OtherClients.onJoin(newClientId => {
			this.lobbies.forEach((lobbyId, lobby) => {
				if (lobby.hostClientId == ClientId) {
					SocketClient.sendToClient('FIRST_TIME_SYNC_LOBBY', newClientId, lobby)
				}
			})
		})
	}

}
