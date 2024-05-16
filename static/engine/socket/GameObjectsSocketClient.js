export class GameObjectsSocketClient {
	constructor(player) {
		this.gameObjects = []
		this.socketClient = new SocketClient(8081, c => {

			c.on('GET_GAME_OBJECTS', data => {
				for (const o of data.gameObjects) {
					const mappedObject = ObjectMapper.mapSingleObject(JSON.stringify(o))
					mappedObject.removeFromGameLoop = () => {
							c.send({
								action: 'REMOVE_OBJECT',
								uuid: o.uuid
							})
					}

					this.gameObjects.push(mappedObject)

					if (mappedObject instanceof Chicken) {
						player.gun.hittableObjects.push(mappedObject)
					}
				}
			})

			c.on('REMOVE_OBJECT', data => {
				for (const o of this.gameObjects) {
					if (o.uuid == data.uuid) {
						List.remove(this.gameObjects, o)
						// List.remove(player.gun.hittableObjects, o)
						break
					}
				}
			})

			c.on('GET_CLIENT_UPDATE', data => {
				for (const p of this.gameObjects) {
					if (p.uuid == data.uuid) {
						p.handledByClientId = data.clientid
						break
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
		for (const o of this.gameObjects) {
			o.update()
			if (Distance.within(100, o, this.player)) {
				ForcePush(o).awayFrom(this.player, 20)
			}

			if (Collision.between(o, this.player)) {
				Push(o).awayFrom(this.player, 0.01)

				o.handledByClientId = this.player.clientId

				this.socketClient.send({
					action: 'GET_CLIENT_UPDATE',
					clientid: o.handledByClientId,
					uuid: o.uuid
				})
			}

			if (o.handledByClientId == this.player.clientId) {
				this.socketClient.send({
					action: 'UPDATE_OBJECT_POSITION',
					x: o.x,
					y: o.y,
					uuid: o.uuid,
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
