export class SocketConnection {
	constructor(player) {
		this.socketClient = new SocketClient()

		this.npc = new Player('')

		this.socketClient.on('UPDATE_PLAYER_POSITION', data => {
			this.npc.x = data.x
			this.npc.y = data.y
		})
	}

	update() {
		this.npc.update()

		this.socketClient.send({
			action: 'UPDATE_PLAYER_POSITION',
			x: this.player.x,
			y: this.player.y,
		})
	}

	draw(draw, guiDraw) {
		this.npc.draw(draw, guiDraw)
	}
}
