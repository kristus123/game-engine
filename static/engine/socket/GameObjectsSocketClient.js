export class GameObjectsSocketClient {
	constructor(allGameObjects, player) {
		this.gameObjects = []

		this.socketClient = new SocketClient(8081, c => {

			c.on('ON_CONNECTION__GET_GAME_OBJECTS', data => {

				for (const p of data.gameObjects) {
					try {
						const x = ObjectMapper.mapSingleObject(JSON.stringify(p))
						allGameObjects.add(this, x)
						this.gameObjects.push(x)
					}
					catch (error) {
						console.log(error)
						throw new Error(error)
					}
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
		for (const g of this.gameObjects) {
			if (Collision.between(g, this.player)) {
				Push(g).awayFrom(this.player, 0.01)

				console.log('moving object')
				this.socketClient.send({
					action: 'UPDATE_OBJECT_POSITION',
					uuid: g.uuid,
					x: g.x,
					y: g.y,
				})
			}
		}
	}

	draw(draw, guiDraw) {
		this.gameObjects.forEach(g => {
			g.draw(draw, guiDraw)
		})
	}
}
