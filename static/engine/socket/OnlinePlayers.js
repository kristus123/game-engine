export class OnlinePlayers {
	constructor(player) {
		this.playersOnline = []

		this.socketClient = new SocketClient(c => {

			c.on('PLAYER_ID', data => {
				player.id = data.playerId
			})

			c.on('PLAYERS_ONLINE', data => {
				this.playersOnline = data.players.map(playerId => {
					const p = new Player("x")
					p.id = playerId
				})
				console.log("player connected")
			})

			c.on('PLAYER_CONNECTED', data => {
				const p = new Player("x")
				p.id = data.playerId
				this.playersOnline.push(p)
				console.log("player connected")
			})

			c.on('PLAYER_DISCONNECTED', data => {
				this.playersOnline
					.filter(p => p.id == data.playerId)
					.map(p => {
						List.remove(this.playersOnline, p)
						return null
					})
			})

			c.on('UPDATE_PLAYER_POSITION', data => {
				this.playersOnline
					.filter(p => p.playerId == data.playerId)
					.map(p => {
						p.position.x = data.x
						p.position.y = data.y
						console.log("update position for player")

						return null
					})
			})
		})
	}

	update() {
		// console.log(this.playersOnline.length)
	}

	updatePositionForPlayer(player) {
		this.socketClient.send({
			action: 'UPDATE_PLAYER_POSITION',
			playerId: player.id,
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
