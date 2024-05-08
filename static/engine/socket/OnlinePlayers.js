export class OnlinePlayers {
	constructor(player) {
		this.connectedPlayers = []

		this.socketClient = new SocketClient(8080, c => {
			this.player.clientId = c.clientId
			console.log("setting local player clientId to " + c.clientId)

			c.on('CONNECTED_PLAYERS', data => {
				for (const clientId of data.clientIds) {
					this.connectedPlayers.push(clientId)
				}
			})

			c.on('NEW_PLAYER_CONNECTED', data => {
					this.connectedPlayers.push(data.clientId)
			})

			c.on('PLAYER_DISCONNECTED', data => {
				console.log(this.connectedPlayers)
				List.remove(this.connectedPlayers, data.clientId)
				console.log(this.connectedPlayers)
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
			})
		})
	}

	update() {
		// console.log(this.connectedPlayers)
	}

	draw(draw, guiDraw) {
	}
}
