export class World {
	constructor() {
		this.client = new SocketClient()
		this.lobby = new LobbyClient(this.client)
		this.wasWKeyPressed = false
		this.wasSKeyPressed = false
		this.wasAKeyPressed = false
		this.wasDKeyPressed = false
		this.lobbyId = null
		this.lobbyNotCreated = true
	}

	update() {
		if (Keyboard.up && !this.wasWKeyPressed) {
			console.log("Creating Lobby...")
			this.lobby.create()	
			this.wasWKeyPressed = true
		}

		if (Keyboard.down && !this.wasSKeyPressed) {
			console.log("Joining Lobby...")
			this.lobbyId = prompt("Enter LobbyId:")
			this.wasSKeyPressed = true
		}

		if (Keyboard.left && !this.wasAKeyPressed) {
			console.log("Leaving Lobby...")
			this.lobby.leave()	
			this.wasAKeyPressed = true
		}

		if (Keyboard.right && !this.wasDKeyPressed) {
			console.log("Closing Lobby...")
			this.lobby.close()
			this.wasDKeyPressed = true
		}


		if(this.lobbyId && this.lobbyNotCreated) {
			this.lobby.join(this.lobbyId)
			this.lobbyNotCreated = false
		}
	}

	draw(draw) {}
}
