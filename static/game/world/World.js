export class World {
	constructor(level) {

		this.player = new Player()
		Camera.followInstantly(this.player)
		Controller.control(this.player)

		this.deliveryDrone = new DeliveryDrone(new Position(2000, 2000), this.player)
		this.onlineObjects = new OnlineObjects(this.player)


		this.localObjects = new LocalObjects([
			 this.deliveryDrone,
			new StarBackground(),
			new Planet(new Position(0, 0)),
			this.onlineObjects,
			new OnlinePlayers(this.player),
			this.player,
			new FirstQuest( this.player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {

		this.localObjects.draw(draw, guiDraw)
	}

}
