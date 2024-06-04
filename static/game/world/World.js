export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		this.deliveryDrone = new DeliveryDrone(new Position(0, 0), this.player, camera, controller)
		this.onlineObjects = new OnlineObjects(this.player)


		this.localObjects = new LocalObjects([
			 this.deliveryDrone,
			new StarBackground(camera),
			new Planet(new Position(0, 0)),
			this.onlineObjects,
			new OnlinePlayers(this.player, camera),
			this.player,
			new FirstQuest(mouse, this.player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {

		this.localObjects.draw(draw, guiDraw)
	}

}
