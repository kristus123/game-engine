export class LobbyClient {
	constructor(socketClient) {
		this.lobbyId = ''
		this.clients = []

		this.socketClient.on("NEW_LOBBY", data => { // what does this do? whats the difference between this and CREATE_LOBBY
			this.clients = data.clients // instead of this, just call CLIENT_JOINS_LOBBY
			console.log(`Connected To Lobby ${this.lobbyId}: [${this.clients}]`)
		})
		
		this.socketClient.on("CLIENT_JOINS_LOBBY", data => {
			this.clients.push(data.clientId)
		})
		
		this.socketClient.on("CLIENT_LEAVES_LOBBY", data => { // we need to find a good name for this. JOINS/LEAVES. they must match
			if (data.originLobbyId === this.lobbyId && data.targetClientId === this.socketClient.clientId) {
				const clientIndex = this.clients.indexOf(data.clientId)
				this.clients.splice(clientIndex, 1)
				console.log(`Client "${data.clientId}" Has Left The Lobby: [${this.clients}]`)
			}
		})

		this.socketClient.on("LOBBY_CLOSED", data => {
			if (data.originLobbyId === this.lobbyId && data.targetClientId === this.socketClient.clientId) {
				this.lobbyId = ''
				this.clients = []
				console.log(`Disconnected From Lobby ${this.lobbyId}`)
			}
		})
	}
	
	create() {
		if(this.lobbyId === '') {
			this.lobbyId = Random.uuid()
			this.socketClient.sendToServer({
				action: "CREATE_LOBBY",
				lobbyId: this.lobbyId,
			})
		} else {
			throw new Error("LobbyClientAPI ERROR: You are already in a Lobby!")
		}
	}

	join(id){
		if(this.lobbyId === '') {
			this.lobbyId = id
			this.socketClient.sendToServer({
				action: "JOIN_LOBBY",
				lobbyId: id
			})
		} else {
			throw new Error("LobbyClientAPI ERROR: You are already in a Lobby!")
		}
	}
	
	leave(){
		if(!(this.lobbyId === '')) {
			this.socketClient.sendToServer({
				action: "LEAVE_LOBBY",
				lobbyId: this.lobbyId
			})
		} else {
			throw new Error("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .leave() function!")
		}
	}

	close(){
		if(!(this.lobbyId === '')) {
			this.socketClient.sendToServer({
				action: "CLOSE_LOBBY",
				lobbyId: this.lobbyId
			})
			// when closing a lobby, other clients should be notified as well
		} else {
			throw new Error("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .close() function!")
		}
	}
}
