import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { SocketClient } from '/static/engine/multiplayer/socket/SocketClient.js'; 
import { AllObjects } from '/static/engine/objects/AllObjects.js'; 
import { Collision } from '/static/engine/physics/Collision.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class OnlineObjects extends AllObjects {
	constructor(player) {
		super()

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 


		this.chickens = []

		this.socketClient = new SocketClient(8081, c => {

			c.on('GET_GAME_OBJECTS', data => {
				const mappedGameObjects = data.gameObjects.map(obj => {
					const mo = ObjectMapper.mapSingleObject(JSON.stringify(obj))

					mo.removeFromGameLoop = () => {
						c.send({
							action: 'REMOVE_OBJECT',
							objectId: obj.objectId
						})
					}

					return mo
				})

				for (const o of mappedGameObjects) {
					super.add(o)

					if (o instanceof Chicken) {
						this.chickens.push(o)
						player.gun.hittableObjects.push(o)
					}
				}
			})

			c.on('REMOVE_OBJECT', data => {
				super.removeByObjectId(data.objectId)
			})

			c.on('OBJECT_HANDLED_BY', data => {
				super.setHandledBy(data.objectId, data.originClientid)
			})

			c.on('UPDATE_OBJECT_POSITION', data => {
				const o = super.get(data.objectId)

				o.position.x = data.x
				o.position.y = data.y
			})
		})
	}

	update() {
		super.updateAnd(o => {

			if (Collision.between(o, this.player)) {
				// Push(o).awayFrom(this.player, 10)

				this.socketClient.send({
					action: 'OBJECT_HANDLED_BY',
					originClientid: this.player.originClientId,
					objectId: o.objectId
				})
			}

			if (o.handledByClientId == this.player.originClientId) {
				this.socketClient.send({
					action: 'UPDATE_OBJECT_POSITION',
					x: o.x,
					y: o.y,
					objectId: o.objectId,
				})
			}
		})
	}

	draw(draw) {
		super.draw(draw)
	}
}
