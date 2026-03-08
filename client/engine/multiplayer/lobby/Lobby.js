// ClientId(

export class Lobby {
	static create() {
    	console.log("creating lobby")

    	const newLobbyId = Random.uuid()

    	WebSocketWrapper.send({
        	action: "CREATE_LOBBY",
        	lobbyId: newLobbyId
    	})

    	return ActiveLobby(newLobbyId, ClientId)
	}

	static join(lobbyId) {
    	WebSocketWrapper.send({
        	action: "JOIN_LOBBY",
        	lobbyId: lobbyId,
    	})

    	return ActiveLobby(lobbyId)
	}
}