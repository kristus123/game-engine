export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.gameObjects = new AllOnlineObjects(this.player)

		this.localObjects = new LocalObjects([
			// this.deliveryDrone,
			new StarBackground(camera),
			new Planet(500, 0),
			this.gameObjects,
			this.player,
			new OnlinePlayers(this.player, camera),
			new CollectChickensQuest(this.player, this.gameObjects.chickens),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
