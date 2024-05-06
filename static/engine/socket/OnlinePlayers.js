export class OnlinePlayers {
	constructor(allGameObjects, player) {
		this.playersOnline = []

		this.socketClient = new SocketClient(8080, c => {

			c.on('ON_CONNECTION__PLAYER_ID', data => {
				player.playerId = data.playerId.toString()
			})

			c.on('ON_CONNECTION__PLAYERS_ONLINE', data => {
				for (const playerId of data.players) {
					const p = new Player("x")
					p.playerId = playerId.toString()

					this.playersOnline.push(p)
					allGameObjects.register(this, p)
				}
			})

			c.on('ON_CONNECTION__PLAYER_CONNECTED', data => {
				const p = new Player("x")
				p.playerId = data.playerId.toString()

				this.playersOnline.push(p)
				allGameObjects.register(this, p)
			})

			c.on('ON_CLOSE__PLAYER_DISCONNECTED', data => {
				for (const p of this.playersOnline) {
					if (p.playerId == data.playerId) {
						List.remove(this.playersOnline, p)
						allGameObjects.remove(this, p)
						break
					}
				}
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
				for (const p of this.playersOnline) {
					if (p.playerId == data.playerId) {
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
			playerId: this.player.playerId,
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
