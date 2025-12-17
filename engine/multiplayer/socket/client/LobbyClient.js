export class LobbyClient {
	constructor(socket_client) {
		this.socket = socket_client
		this.connectedLobbyId = ''
		this.clientList = []

		this.socket.on("NEW_LOBBY", data => {
			if (this.socket.clientId === data.json['admin']) {
				this.connectedLobbyId = data.json['lobbyId']
				this.clientList = data.json['clientList']
				console.log(`Connected To Lobby ${this.connectedLobbyId}`)
			}
		})

		this.socket.on("UPDATE_LOBBY_CLIENT_LIST", data => {
			if (data.originLobbyId === this.connectedLobbyId && data.targetClientId === this.socket.clientId) {
				this.clientList = data.json
				console.log(`Updated Client List: [${this.clientList}]`)
			}
		})

		this.socket.on("LOBBY_CLOSED", data => {
			if (data.originLobbyId === this.connectedLobbyId && data.targetClientId === this.socket.clientId) {
				this.connectedLobbyId = ''
				this.clientList = []
				console.log(`Disconnected From Lobby ${this.connectedLobbyId}`)
			}
		})

		// FIXME: Does Not Work!
		this.socket.on("close", data => { this.leave() })
	}
	
	create() {
		if(!(this.connectedLobbyId === '')) {
			console.log("LobbyClientAPI ERROR: You are already in a Lobby!")
			return
		}
		this.socket.sendRaw({
			action: "CREATE_LOBBY",
			json: {}
		})
	}

	join(id){
		if(!(this.connectedLobbyId === '')) {
			console.log("LobbyClientAPI ERROR: You are already in a Lobby!")
			return
		}
		this.connectedLobbyId = id
		this.socket.sendRaw({
			action: "JOIN_LOBBY",
			json: {
				lobbyId: id
			}
		})
	}
	
	leave(){
		if(this.connectedLobbyId === '') {
			console.log("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .leave() function!")
			return
		}
		this.socket.sendRaw({
			action: "LEAVE_LOBBY",
			json: {
				lobbyId: this.connectedLobbyId
			}
		})
	}

	close(){
		if(this.connectedLobbyId === '') {
			console.log("LobbyClientAPI ERROR: You need to be connected to a lobby before calling the .close() function!")
			return
		}
		this.socket.sendRaw({
			action: "CLOSE_LOBBY",
			json: {
				lobbyId: this.connectedLobbyId
			}
		})
	}
}
