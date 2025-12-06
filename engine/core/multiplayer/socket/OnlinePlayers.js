export class OnlinePlayers {
	constructor(player) {
		this.connectedPlayers = []

		this.socketClient = new SocketClient(8080, c => {
			player.clientId = c.clientId

			c.on('CONNECT_PLAYER', data => {
				const p = new Player('x')
				p.clientId = data.clientId
				this.connectedPlayers.push(p)
			})

			c.on('PLAYER_DISCONNECTED', data => {
				this.connectedPlayers.removeIf(p => p.clientId == data.clientId)
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
				for (const p of this.connectedPlayers) {
					if (data.clientId == p.clientId) {
						p.x = data.x
						p.y = data.y
						break
					}
				}
			})
		})
	}

	update() {
		this.socketClient.send({
			action: 'UPDATE_PLAYER_POSITION',
			x: this.player.x,
			y: this.player.y,
		})
	}

	draw(draw) {
		for (const p of this.connectedPlayers) {
			p.draw(draw)
		}
	}
}
