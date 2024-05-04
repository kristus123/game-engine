export class OnlinePlayers {
	constructor(allGameObjects, player) {
		this.playersOnline = []

		this.socketClient = new SocketClient(c => {

			c.on('ON_CONNECTION_PLAYER_ID', data => {
				player.playerId = data.playerId.toString()
			})

			c.on('PLAYERS_ONLINE', data => {
				for (const playerId of data.players) {
					const p = new Player("x")
					p.playerId = playerId.toString()

					this.playersOnline.push(p)
					allGameObjects.register(this, p)
				}
			})

			c.on('PLAYER_CONNECTED', data => {
				const p = new Player("x")
				p.playerId = data.playerId.toString()

				this.playersOnline.push(p)
				allGameObjects.register(this, p)
			})

			c.on('PLAYER_DISCONNECTED', data => {
				for (const p of this.playersOnline) {
					if (p.playerId == data.playerId) {
						List.remove(this.playersOnline, p)
						allGameObjects.remove(this, p)
					}
				}
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
				for (const p of this.playersOnline) {
					if (p.playerId == data.playerId) {
						p.x = data.x
						p.y = data.y
					}
				}
			})
		})
	}

	update() {
	}

	updatePositionForPlayer(player) {
		this.socketClient.send({
			action: 'UPDATE_PLAYER_POSITION',
			playerId: player.playerId,
			x: player.x,
			y: player.y,
		})
	}

	draw(draw, guiDraw) {
		this.playersOnline.forEach(p => {
			p.draw(draw, guiDraw)
		})
	}
}
