export class World {
	constructor(levelSelector, allGameObjects, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		this.onlinePlayers = new OnlinePlayers(this.player)
		this.onlinePlayers.playersOnline.forEach(p => {
			allGameObjects.register(this, p)
		})

		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)

		allGameObjects.register(this, [
			new StarBackground(camera),
			new Planet(500, 0),
			this.player,
			// this.deliveryDrone,
		])

		ObjectPersistence.get().forEach(o => {
			allGameObjects.add(this, o)
		})
	}

	update() {
		this.onlinePlayers.update()
		this.onlinePlayers.updatePositionForPlayer(this.player)
	}

	draw(draw, guiDraw) {
		this.onlinePlayers.draw(draw, guiDraw)
	}
}
