export class GameObjectsSocketClient {
	constructor(allGameObjects, player) {
		this.gameObjects = []
		this.socketClient = new SocketClient(8081, c => {

			c.on('GET_GAME_OBJECTS', data => {
				for (const p of data.gameObjects) {
					this.gameObjects.push(ObjectMapper.mapSingleObject(JSON.stringify(p)))
				}
			})

			c.on('GET_CLIENT_UPDATE', data =>{
				for (const p of this.gameObjects) {
					if(p.uuid == data.uuid){
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
			if (Collision.between(o, this.player)) {
				Push(o).awayFrom(this.player, 0.01)

				o.handledByClientId = this.player.clientId

				this.socketClient.send({
					action:'GET_CLIENT_UPDATE',
					clientid:o.handledByClientId,
					uuid:o.uuid
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
