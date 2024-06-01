export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)


		 this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.onlineObjects = new OnlineObjects(this.player)

		const quest = new Quest([
			//new CollectChickensQuest(mouse, this.player, this.onlineObjects.chickens),
			ObjectClass(
				{
					deliveryZone: new DeliveryZone(new Position(100, 0, 100, 100), this.player),
					chickens: [
						new Chicken(new Position(0, 0)),
						new Chicken(new Position(-100, 0)),
					]
				},
				{
					completed: (p) => p.deliveryZone.amountDelivered == 1,
					update: (p) => {
						for (const c of p.chickens) {
							ForcePush(c).towards(this.deliveryDrone)
						}
						
						p.deliveryZone.update()
					},
					draw: (draw, guiDraw, p) => {
						for (const c of p.chickens) {
							c.draw(draw, guiDraw)
						}
						p.deliveryZone.draw(draw, guiDraw)
					},
				}
			),
		],() => {
			console.log("quest finished")
		})

		this.localObjects = new LocalObjects([
			 this.deliveryDrone,
			new StarBackground(camera),
			new Planet(new Position(0, 0)),
			this.onlineObjects,
			new OnlinePlayers(this.player, camera),
			this.player,
			quest,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
