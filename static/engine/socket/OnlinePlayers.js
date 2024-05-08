export class OnlinePlayers {
	constructor(allGameObjects, player) {
		this.playersOnline = []

		Overlay.addTop("hola amigo")

		this.socketClient = new SocketClient(8080, c => {

			player.clientId = c.clientId.toString()

			c.on('CONNECTED_PLAYERS', data => {
				for (const clientId of data.clientIds) {
					const p = new Player("x")
					p.clientId = clientId.toString()

					this.playersOnline.push(p)
					// allGameObjects.add(this, p)
				}
			})

			c.on('NEW_PLAYER_CONNECTED', data => {
				console.log("new player connectec")
				const p = new Player("x")
				p.clientId = data.clientId.toString()

				this.playersOnline.push(p)
				// allGameObjects.add(this, p)
			})

			c.on('PLAYER_DISCONNECTED', data => {
				for (const p of this.playersOnline) {
					if (p.clientId == data.clientId) {
						console.log("removed " + p.clientId)
						List.remove(this.playersOnline, p)
						// allGameObjects.remove(this, p)
						break
					}
				}
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
				console.log("updating position for player")
				console.log(JSON.stringify(data))
				for (const player of this.playersOnline) {
					if (player.clientId == data.clientId) {
						player.x = data.x
						player.y = data.y
						return
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
