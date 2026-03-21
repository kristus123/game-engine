// ClientId(

export class Lobby {
	static {
		// { lobbyId: hostClientId, ... }
		this.activeLobbies = {}

		SocketClient.onClientMessage("GET_LOBBY_LIST", data => {
			SocketClient.sendToClient("SYNC_LOBBY_LIST", data.originClientId, {
				activeLobbies: this.activeLobbies
			})
		})

		SocketClient.onClientMessage("SYNC_LOBBY_LIST", data => {
			this.activeLobbies = data.activeLobbies
		})

		// Get Active Lobbies On Join
    	OtherClients.onReady(() => {
			if (Object.keys(this.activeLobbies).length == 0 && OtherClients.ids.length > 0) {
				SocketClient.sendToClient("GET_LOBBY_LIST", OtherClients.ids[0], {})
			}
    	})
	}

	static create() {
		console.log("creating lobby...")

		const newLobby = ActiveLobby(Random.uuid(), ClientId)

		Lobby.activeLobbies[newLobby.lobbyId] = newLobby.hostClientId

		SocketClient.sendToOtherClients("SYNC_LOBBY_LIST",
			{
				activeLobbies: Lobby.activeLobbies,
			}
		)

		newLobby.clients.push(ClientId)

		return newLobby
	}

	static join(lobbyId, hostClientId) {
		console.log("joining lobby...")

		const targetLobby = ActiveLobby(lobbyId, hostClientId)

		SocketClient.sendToClient("JOIN_LOBBY", hostClientId, {
			lobbyId: lobbyId
		})

		SocketClient.onClientMessage("JOINED_LOBBY", data => {
			targetLobby.clients = data.clients
		})

		return targetLobby
	}
}
