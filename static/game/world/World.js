export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

		this.info = Html.text('na')

		this.deliveryDrone = new DeliveryDrone(this.player, camera, controller, new Position(2000, 2000), -100, 0)
		this.onlineObjects = new OnlineObjects(this.player)

		const quest = new Quest([
			new CollectChickensQuest(mouse, this.player, this.onlineObjects.chickens),
			ObjectClass(
				{
					deliveryZone: new DeliveryZone(new Position(100, 0, 100, 100), this.player),
					chickens: [
						new Chicken(new Position(0, 0)),
						new Chicken(new Position(-100, 0)),
					],
					chat: new MultiTextTyper(this.player.position.offset(0, -50), [
						'use wasd or arrows to drive',
					]),
				},
				{
					completed: (p) => p.deliveryZone.amountDelivered == 1,
					update: (p) => {
						p.deliveryZone.update()
						p.chat.update()
					},
					draw: (draw, guiDraw, p) => {
						console.log(this.deliveryDrone.x)
						for (const c of p.chickens) {
							c.position = this.deliveryDrone.position.copy()
							c.draw(draw, guiDraw)
						}
						p.deliveryZone.draw(draw, guiDraw)
						p.chat.draw(draw, guiDraw)
					},
				},
			),
			ObjectClass(
				{
					npc: new Npc(this.player.position.copy()),
					e: new Key('e'),
					chat: new MultiTextTyper(this.player.position.copy(), [
						'use wasd or arrows to drive',
						'Current objective:',
						'Deliver package',
						'',
						'',
						'Would be nice to have a greater purpose',
						'',
						'',
						'Maybe one day',
						'',
						'',
						'But not today',
					]),
				},
				{
					completed: () => {
						return false
					},
					update: (p) => {
						p.npc.update()
					},
					draw: (draw, guiDraw, p) => {
						if (Distance.within(50, this.player, p.npc)) {
							p.chat.update()
							p.chat.draw(draw, guiDraw)
						}

						p.npc.draw(draw, guiDraw)
					},
				},
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
		this.info.text('velocity: ' + this.player.velocity.x)
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
