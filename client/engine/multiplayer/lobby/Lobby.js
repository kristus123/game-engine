// ClientId(

export class Lobby {
	static {
		this.activeLobbyList = []

		SocketClient.onClientMessage("GET_LOBBY_LIST", data => {
			SocketClient.sendToClient("SYNC_LOBBY_LIST", data.originClientId, {
				lobbyList: this.activeLobbyList
			})
		})

		SocketClient.onClientMessage("SYNC_LOBBY_LIST", data => {
			this.activeLobbyList = data.lobbyList

			console.log(this.activeLobbyList)
		})
	}

	static refresh() {
		if (OtherClients.ids.length > 0) {
			console.log("getting client list...")

			SocketClient.sendToClient("GET_LOBBY_LIST", OtherClients.ids[0], {})
		}
	}
	
	static create() {
	    console.log("creating lobby...")

		const newLobby = ActiveLobby(Random.uuid(), ClientId)

		this.activeLobbyList.push(newLobby.lobbyId)

		SocketClient.sendToOtherClients("SYNC_LOBBY_LIST",
			{
				lobbyList: this.activeLobbyList,
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
