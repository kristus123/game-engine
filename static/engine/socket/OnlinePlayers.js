export class OnlinePlayers {
	constructor(allGameObjects, player) {
		this.playersOnline = []

		this.socketClient = new SocketClient(8080, c => {

			c.on('CONNECTED_PLAYERS', data => {
				for (const clientId of data.clientIds) {
					const p = new Player("x")
					p.clientId = clientId.toString()

					this.playersOnline.push(p)
					allGameObjects.register(this, p)
				}
			})

			c.on('NEW_PLAYER_CONNECTED', data => {
				const p = new Player("x")
				p.clientId = data.clientId.toString()

				this.playersOnline.push(p)
				allGameObjects.register(this, p)
			})

			c.on('PLAYER_DISCONNECTED', data => {
				for (const p of this.playersOnline) {
					if (p.clientId == data.clientId) {
						List.remove(this.playersOnline, p)
						allGameObjects.remove(this, p)
						break
					}
				}
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
				for (const player of this.playersOnline) {
					if (player.clientId == data.clientId) {
						player.x = data.x
						player.y = data.y
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

	draw(draw, guiDraw) {
		this.playersOnline.forEach(p => {
			p.draw(draw, guiDraw)
		})
	}
}
