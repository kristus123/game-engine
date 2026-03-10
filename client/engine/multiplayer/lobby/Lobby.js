// ClientId(

export class Lobby {
	static create() {
	    	console.log("creating lobby...")

		const newLobby = ActiveLobby(Random.uuid(), ClientId)
		newLobby.clients.push(ClientId)

    		return newLobby
	}

	static join(lobbyId, hostClientId) {
		console.log("joining lobby...")

		SocketClient.sendToClient("JOIN_LOBBY", hostClientId, {
			lobbyId: lobbyId
		})

		SocketClient.onClientMessage("JOINED_LOBBY", data => {
			const targetLobby = ActiveLobby(lobbyId, hostClientId)
			targetLobby.clients = data.clients
			
			return targetLobby
		})

		return null
	}
}
