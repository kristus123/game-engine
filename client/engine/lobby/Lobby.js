export class Lobby {

	static create() {
		const lobby = LobbyManager.createLobby(Random.uuid(), ClientId)

		SocketClient.sendToOtherClients('CLIENT_CREATED_NEW_LOBBY', {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static join(lobbyId) {
		const lobby = LobbyManager.joinLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients('CLIENT_JOINS_LOBBY', {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static leave(lobbyId) {

		LobbyManager.leaveLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients('CLIENT_LEAVES_LOBBY', {
			lobbyId: lobbyId,
		})
	}

	static {
		SocketClient.onClientMessage('CLIENT_CREATED_NEW_LOBBY', data => {
			LobbyManager.createLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage('CLIENT_JOINS_LOBBY', data => {
			LobbyManager.joinLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage('CLIENT_LEAVES_LOBBY', data => {
			LobbyManager.leaveLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage('SYNC_LOBBY', data => {
			const lobby = LobbyManager.createLobby(data.lobbyId, data.hostClientId)
			for (const c of data.connectedClientIds) {
				lobby.connectedClientIds.add(c)
			}
		})

		OtherClients.onJoin(newClientId => {
			for (const lobby of LobbyManager.myLobbies()) {
				SocketClient.sendToClient('SYNC_LOBBY', newClientId, lobby)
			}
		})
	}

}

