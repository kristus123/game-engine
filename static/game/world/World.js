export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		 this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.onlineObjects = new OnlineObjects(this.player)

		this.localObjects = new LocalObjects([
			 this.deliveryDrone,
			new StarBackground(camera),
			new Planet(new Position(0, 0)),
			this.onlineObjects,
			this.player,
			new OnlinePlayers(this.player, camera),
			new Quest([
				new CollectChickensQuest(mouse, this.player, this.onlineObjects.chickens),
				ObjectClass(
					{
						deliveryZone: new DeliveryZone(new Position(100, 0, 100, 100), [this.player]),
					},
					{
						completed: (p) => p.deliveryZone.amountDelivered == 1,
						update: (p) => {
							p.deliveryZone.update()
						},
						draw: (draw, guiDraw, p) => {
							p.deliveryZone.draw(draw, guiDraw)
						},
					}
				),
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
