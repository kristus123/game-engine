export class World {
	constructor(levelSelector, allGameObjects, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)

		this.onlinePlayers = new OnlinePlayers(allGameObjects, this.player)
		this.gameObjects = new GameObjectsSocketClient(allGameObjects, this.player)

		this.runAll = new RunAll([
			// this.deliveryDrone,
			new StarBackground(camera),
			new Planet(500, 0),
			this.onlinePlayers,
			this.gameObjects,
			this.player,
		])
	}

	update() {
		this.runAll.update()
		this.onlinePlayers.updatePositionForPlayer(this.player)
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
