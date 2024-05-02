export class World {
	constructor(levelSelector, allGameObjects, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, this.player, -100, 0)

		allGameObjects.register(this, [
			new StarBackground(camera),
			new Planet(500, 0),
			this.player,
			this.deliveryDrone,
		])
	}

	update() {
	}

	draw(draw, guiDraw) {
	}
}
