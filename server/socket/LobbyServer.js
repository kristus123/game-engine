module.exports = class {
	constructor(socket_server) {
		this.socket = socket_server
		this.lobbyList = {}

		this.socket.on("CREATE_LOBBY", (client, clientId, data) => {
			console.log("Creating Lobby...")
			
			const lobbyId = "lobbyid123"
			this.createLobby(lobbyId, clientId)

			this.socket.sendToClient(client, {
				action: "UPDATE_LOBBY_CLIENT_LIST",
				json: this.lobbyList[lobbyId].clientList
			})
		})
	}
	createLobby(lobbyId, clientId) {
		this.lobbyList[lobbyId] = {
			clientList: [
				clientId,
			]
		}
	}
}
