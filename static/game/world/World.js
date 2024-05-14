export class World {
	constructor(levelSelector, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.gameObjects = new GameObjectsSocketClient(this.player)

		this.chicken = new Chicken()

		this.player.gun.hittableObjects.push(this.chicken)

		this.runAll = new RunAll([
			// this.deliveryDrone,
			new StarBackground(camera),
			new Planet(500, 0),
			// this.gameObjects,
			this.player,
			new OnlinePlayers(this.player, camera),
			this.chicken,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
