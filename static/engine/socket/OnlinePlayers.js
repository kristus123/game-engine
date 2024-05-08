export class OnlinePlayers {
	constructor(player) {
		this.connectedPlayers = []

		this.socketClient = new SocketClient(8080, c => {
			this.player.clientId = c.clientId
			console.log("setting local player clientId to " + c.clientId)

			c.on('CONNECT_PLAYER', data => {
				this.connectedPlayers.push(data.clientId)
			})

			c.on('PLAYER_DISCONNECTED', data => {
				List.remove(this.connectedPlayers, data.clientId)
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
			})
		})
	}

	update() {
		console.log(this.connectedPlayers)
	}

	draw(draw, guiDraw) {
	}
}
