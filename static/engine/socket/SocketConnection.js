export class SocketConnection {
	constructor(player) {

		this.ws = new WebSocket('ws://localhost:8080')

		this.ws.onopen = () => {
		  console.log('Connected to server')
		}

		this.npc = new Npc()
		this.runAll = new RunAll([
			this.npc,
		])

		this.ws.onmessage = e => {
			const data = JSON.parse(e.data)

			if (data.action == 'UPDATE_PLAYER_POSITION') {
				this.npc.x = data.position.x
				this.npc.y = data.position.y
			}
		}

		this.ws.onclose = () => {
		  console.log('Connection closed')
		}
	}

	send(data) {
	  if (this.ws.readyState === WebSocket.OPEN) {
	    this.ws.send(JSON.stringify(data))
	  }
	}

	update() {
		this.runAll.update()

		this.send({
			x: this.player.x,
			y: this.player.y,

		})
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
