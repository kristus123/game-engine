export class LobbyClient {
	constructor(socketClient) {
		this.socketClient = socketClient
		this.lobbyId = ''
		this.clients = []

		this.socketClient.on("NEW_LOBBY", data => {
			this.clients = data.clients
			console.log(`Connected To Lobby ${this.lobbyId}: [${this.clients}]`)
		})
		
		this.socketClient.on("CLIENT_JOINS_LOBBY", data => {
			if (data.originLobbyId === this.lobbyId && data.targetClientId === this.socketClient.clientId) {
				this.clients.push(data.clientId)
				console.log(`Client "${data.clientId}" Has Joined The Lobby: [${this.clients}]`)
			}
		})
		
		this.socketClient.on("CLIENT_LEFT_LOBBY", data => {
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
			this.socketClient.sendRaw({
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
			this.socketClient.sendRaw({
				action: "JOIN_LOBBY",
				lobbyId: id
			})
		} else {
			throw new Error("LobbyClientAPI ERROR: You are already in a Lobby!")
		}
	}
	
	leave(){
		if(!(this.lobbyId === '')) {
			this.socketClient.sendRaw({
				action: "LEAVE_LOBBY",
				lobbyId: this.lobbyId
			})
		} else {
			throw new Error("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .leave() function!")
		}
	}

	close(){
		if(!(this.lobbyId === '')) {
			this.socketClient.sendRaw({
				action: "CLOSE_LOBBY",
				lobbyId: this.lobbyId
			})
		} else {
			throw new Error("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .close() function!")
		}
	}
}
