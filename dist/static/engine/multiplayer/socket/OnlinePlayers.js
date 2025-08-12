import { List } from '/static/engine/List.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { SocketClient } from '/static/engine/multiplayer/socket/SocketClient.js'; 
import { Player } from '/static/game/entities/Player.js'; 

export class OnlinePlayers {
	constructor(player) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 

		this.connectedPlayers = []

		this.socketClient = new SocketClient(8080, c => {
			player.clientId = c.clientId

			c.on('CONNECT_PLAYER', data => {
				const p = new Player('x')
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
		for (const p of this.connectedPlayers) {
			p.draw(draw, guiDraw)
		}
	}
}
