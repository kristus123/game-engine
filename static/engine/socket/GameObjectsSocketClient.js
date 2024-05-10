export class GameObjectsSocketClient {
	constructor(allGameObjects, player) {
		this.gameObjects = []

		this.socketClient = new SocketClient(8081, c => {

			c.on('GET_GAME_OBJECTS', data => {
				for (const p of data.gameObjects) {
					try {
						const x = ObjectMapper.mapSingleObject(JSON.stringify(p))
						allGameObjects.add(this, x)
						this.gameObjects.push(x)
					} catch (error) {
						console.log(error)
						throw new Error(error)
					}
				}
			})
			c.on("GET_CLINET_UPDATE", data =>{
				for (const p of this.gameObjects) {
					p.handledByClientId = data.uuid
				}
			})
			c.on('UPDATE_OBJECT_POSITION', data => {
				for (const p of this.gameObjects) {
					if (p.uuid == data.uuid) {
						p.position.x = data.x
						p.position.y = data.y
						break
					}
				}

			})
		})
	}

	update() {
		for (const o of this.gameObjects) {
			if (Collision.between(o, this.player) && o.handledByClientId == this.player.clientId) {
				Push(o).awayFrom(this.player, 0.01)
				
			}
			this.socketClient.send({
				action: 'UPDATE_OBJECT_POSITION',
				x: o.x,
				y: o.y,
				uuid: o.uuid,
			})
			
			this.socketClient.send({
				action:"GET_CLINET_UPDATE",
				uuid:o.handledByClientId
			})
		}
	}

	draw(draw, guiDraw) {
		this.gameObjects.forEach(g => {
			g.draw(draw, guiDraw)
		})
	}
}
