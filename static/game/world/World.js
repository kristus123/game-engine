export class World {
	constructor(levelSelector, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)


		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.gameObjects = new GameObjectsSocketClient(this.player)

		this.runAll = new RunAll([
			// this.deliveryDrone,
			new StarBackground(camera),
			new Planet(500, 0),
			new OnlinePlayers(this.player),
			this.gameObjects,
			this.player,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
