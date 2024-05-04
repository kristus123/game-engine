export class World {
	constructor(levelSelector, allGameObjects, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)


		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)


		this.onlinePlayers = new OnlinePlayers(allGameObjects, this.player)

		allGameObjects.register(this, [
			this.onlinePlayers,
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
		this.onlinePlayers.updatePositionForPlayer(this.player)
	}

	draw(draw, guiDraw) {
	}
}
