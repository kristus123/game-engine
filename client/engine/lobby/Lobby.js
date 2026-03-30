export class Lobby {

	static create() {
		const lobby = LobbyManager.createLobby(Random.uuid(), ClientId, this.onLobbyUpdate)

		SocketClient.sendToOtherClients("CLIENT_CREATED_NEW_LOBBY", {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static join(lobbyId) {
		const lobby = LobbyManager.joinLobby(lobbyId, ClientId, this.onLobbyUpdate)

		SocketClient.sendToOtherClients("CLIENT_JOINS_LOBBY", {
			lobbyId: lobby.lobbyId,
		})

		return lobby
	}

	static leave(lobbyId) {

		LobbyManager.leaveLobby(lobbyId, ClientId)

		SocketClient.sendToOtherClients("CLIENT_LEAVES_LOBBY", {
			lobbyId: lobbyId,
		})
	}

	static get all() {
		return LobbyManager.lobbies
	}

	static onNewLobby(callback) {
		for (const lobby of this.all.values) {
			callback(lobby)
		}

		this.newLobbyListener.listen(callback)
	}

	static {
		this.newLobbyListener = Listener()
		
		this.onLobbyUpdate = function(lobbyId, key, value){
			SocketClient.sendToOtherClients("UPDATE_CLIENT_OBJECT", {
				lobbyId: lobbyId,
				key: key,
				value: value
			})
		}

		SocketClient.onClientMessage("CLIENT_CREATED_NEW_LOBBY", data => {
			const lobby = LobbyManager.createLobby(data.lobbyId, data.originClientId, this.onLobbyUpdate)
			
			this.newLobbyListener.trigger(lobby)
		})

		SocketClient.onClientMessage("CLIENT_JOINS_LOBBY", data => {
			LobbyManager.joinLobby(data.lobbyId, data.originClientId, this.onLobbyUpdate)
		})

		SocketClient.onClientMessage("CLIENT_LEAVES_LOBBY", data => {
			LobbyManager.leaveLobby(data.lobbyId, data.originClientId)
		})

		SocketClient.onClientMessage("SYNC_LOBBY", data => {
			const lobby = LobbyManager.createLobby(data.lobbyId, data.hostClientId, this.onLobbyUpdate)
			data.clients.forEach((c, o) => {
				lobby.clients[c] = o
			})
		})

		SocketClient.onClientMessage("UPDATE_CLIENT_OBJECT", data => {
			const lobby = LobbyManager.lobbies[data.lobbyId]
			lobby.clients[data.originClientId][data.key] = data.value
		})

		OtherClients.onJoin(newClientId => {
			for (const lobbyId of LobbyManager.myLobbies()) {
				const lobby = LobbyManager.lobbies[lobbyId]
				
				SocketClient.sendToClient("SYNC_LOBBY", newClientId, {
					lobbyId: lobby.lobbyId,
            		hostClientId: lobby.hostClientId,
            		clients: Object.fromEntries(
                		Object.entries(lobby.clients).map(([id, obj]) => [id, { ...obj }])
            		)
        		})
			}
		})
	}

}