export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		// this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.onlineObjects = new OnlineObjects(this.player)

		this.localObjects = new LocalObjects([
			// this.deliveryDrone,
			new StarBackground(camera),
			new Planet(500, 0),
			this.onlineObjects,
			this.player,
			new OnlinePlayers(this.player, camera),
			new Quest([
				new CollectChickensQuest(mouse, this.player, this.onlineObjects.chickens),
				class {
					constructor() {

					}

					update() {

					}

					draw(draw, guiDraw) {

					}
				}
			]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
