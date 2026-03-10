// ClientId(

export class Lobby {
	static create() {
	    	console.log("creating lobby...")

		const newLobby = ActiveLobby(Random.uuid(), ClientId)
		newLobby.clients.push(ClientId)

    		return newLobby
	}

	static join(lobbyId, hostClientId, callback) {
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
