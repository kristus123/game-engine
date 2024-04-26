export class SocketConnection {
	constructor(player) {

		this.ws = new WebSocket('ws://localhost:8080')

		this.ws.onopen = () => {
		  console.log('Connected to server')
		}

		this.npc = new Npc()

		this.ws.onmessage = e => {
			const data = JSON.parse(e.data)

			if (data.action == 'UPDATE_PLAYER_POSITION') {
				this.npc.x = data.x
				this.npc.y = data.y
			}
		}

		this.ws.onclose = () => {
		  console.log('Connection closed')
		}
	}

	update() {
		this.npc.update()

		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({
				action: 'UPDATE_PLAYER_POSITION',
				x: this.player.x,
				y: this.player.y,
			}))
		}
	}

	draw(draw, guiDraw) {
		this.npc.draw(draw, guiDraw)
	}
}
