export class World {
	constructor(level, camera) {

		this.player = new Player(camera)
		camera.followInstantly(this.player)
		Controller.control(this.player)

		this.deliveryDrone = new DeliveryDrone(new Position(2000, 2000), this.player, camera)
		this.onlineObjects = new OnlineObjects(this.player)


		this.localObjects = new LocalObjects([
			 this.deliveryDrone,
			new StarBackground(camera),
			new Planet(new Position(0, 0)),
			this.onlineObjects,
			new OnlinePlayers(this.player, camera),
			this.player,
			new FirstQuest(camera, this.player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {

		this.localObjects.draw(draw, guiDraw)
	}

}
