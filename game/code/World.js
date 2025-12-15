export class World {
	constructor() {
		this.client = new SocketClient()
		this.lobby = new LobbyClient(this.client)
		this.wasSKeyPressed = false
	}

	update() {
		if (Keyboard.down && !this.wasSKeyPressed) {
			this.lobby.start()		
			this.wasSKeyPressed = true
		}
	}

	draw(draw) {
	}
}
