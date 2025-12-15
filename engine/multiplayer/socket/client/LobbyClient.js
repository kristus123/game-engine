export class LobbyClient {
	constructor(socket_client) {
		this.socket = socket_client
		this.clientList = []

		this.socket.on("UPDATE_LOBBY_CLIENT_LIST", data => {
			this.clientList = data.json
			console.log(`list: ${this.clientList}`)
		})
	}
	
	start() {
		this.socket.sendRaw({
			action: "CREATE_LOBBY",
			json: {}
		})
	}
}
