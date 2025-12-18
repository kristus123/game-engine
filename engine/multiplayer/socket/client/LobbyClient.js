export class LobbyClient {
	constructor(socketClient) {

		this.lobbyId = ''
		this.clients = []

		this.socketClient.on("CLIENT_JOINS_LOBBY", data => {
			this.clients.push(data.clientId)
		})

		this.socketClient.on("CLIENT_LEAVES_LOBBY", data => {
			this.clients.remove(data.clientId)
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
		if (this.lobbyId === '') {
			this.lobbyId = Random.uuid()
			this.clients = []

			this.socketClient.sendToServer("CREATE_LOBBY", {
				lobbyId: this.lobbyId,
			})
		}
		else {
			throw new Error("LobbyClientAPI ERROR: You are already in a Lobby!")
		}
	}

	join(lobbyId) {
		if (this.lobbyId === '') {
			this.lobbyId = lobbyId
			this.socketClient.send({
				action: "JOIN_LOBBY",
				json: {
					lobbyId: lobbyId
				}
			})
		}
		else {
			throw new Error("LobbyClientAPI ERROR: You are already in a Lobby!")
		}
	}
	
	leave() {
		if(this.lobbyId === '') {
			console.log("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .leave() function!")
		}
		else {
			this.socketClient.send({
				action: "LEAVE_LOBBY",
				lobbyId: this.lobbyId,
			})

			this.lobbyId = ''
		}
	}

	close() {
		if(this.lobbyId === '') {
			console.log("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .close() function!")
			return
		}
		this.socketClient.send({
			action: "CLOSE_LOBBY",
			json: {
				lobbyId: this.lobbyId
			}
		})
	}
}
