export class SocketConnection {
	constructor() {
		this.sc = new SocketClient()

		this.npc = new Npc()

		this.sc.message = data => {
			if (data.action == 'UPDATE_PLAYER_POSITION') {
				this.npc.x = data.x
				this.npc.y = data.y
			}
		}
	}

	update() {
		this.npc.update()

		this.sc.send({
			action: 'UPDATE_PLAYER_POSITION',
			x: this.player.x,
			y: this.player.y,
		})
	}

	draw(draw, guiDraw) {
		this.npc.draw(draw, guiDraw)
	}
}
