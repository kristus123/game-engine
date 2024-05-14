export class OnlinePlayers {
	constructor(player, camera) {
		this.connectedPlayers = []

		this.socketClient = new SocketClient(8080, c => {
			player.clientId = c.clientId

			c.on('CONNECT_PLAYER', data => {
				const mouse = new Mouse(camera)
				const p = new Player(mouse)
				p.clientId = data.clientId
				this.connectedPlayers.push(p)
			})

			c.on('PLAYER_DISCONNECTED', data => {
				List.removeIf(this.connectedPlayers, p => p.clientId == data.clientId)
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

			c.on('UPDATE_MOUSE_POSITION', data => {
				for (const p of this.connectedPlayers) {
					if (data.clientId == p.clientId) {
						p.mouse.position.x = data.x
						p.mouse.position.y = data.y
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

		this.socketClient.send({
			action: 'UPDATE_MOUSE_POSITION',
			x: this.player.mouse.position.x,
			y: this.player.mouse.position.y,
		})
	}

	draw(draw, guiDraw) {
		for (const p of this.connectedPlayers) {
			p.draw(draw, guiDraw)
		}
	}
}
