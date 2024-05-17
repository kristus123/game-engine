export class GameObjectsSocketClient {
	constructor(player) {
		this.allGameObjects = new AllGameObjects()

		this.socketClient = new SocketClient(8081, c => {

			c.on('GET_GAME_OBJECTS', data => {
				const x = data.gameObjects
					.map(o => ObjectMapper.mapSingleObject(JSON.stringify(o)))
					.map(o => {
						o.removeFromGameLoop = () => {
							c.send({
								action: 'REMOVE_OBJECT',
								objectId: o.objectId
							})
						}

						return o
					})

				for (const o of x) {
					this.allGameObjects.add(o)

					if (o instanceof Chicken) {
						player.gun.hittableObjects.push(o)
					}
				}
			})

			c.on('REMOVE_OBJECT', data => {
				this.allGameObjects.removeByObjectId(data.objectId)
			})

			c.on('GET_CLIENT_UPDATE', data => {
				this.allGameObjects.setHandledBy(data.objectId, data.clientid)
			})

			c.on('UPDATE_OBJECT_POSITION', data => {
				this.allGameObjects.getByObjectId(data.objectId, o => {
					p.position.x = data.x
					p.position.y = data.y
				})
			})
		})
	}

	update() {
		this.allGameObjects.updateAnd(o => {
			if (Distance.within(100, o, this.player)) {
				ForcePush(o).awayFrom(this.player, 20)
			}

			if (Collision.between(o, this.player)) {
				Push(o).awayFrom(this.player, 0.01)

				o.handledByClientId = this.player.clientId

				this.socketClient.send({
					action: 'GET_CLIENT_UPDATE',
					clientid: o.handledByClientId,
					objectId: o.objectId
				})
			}

			if (o.handledByClientId == this.player.clientId) {
				this.socketClient.send({
					action: 'UPDATE_OBJECT_POSITION',
					x: o.x,
					y: o.y,
					objectId: o.objectId,
				})
			}
		})
	}

	draw(draw, guiDraw) {
		this.allGameObjects.draw(draw, guiDraw)
	}
}
