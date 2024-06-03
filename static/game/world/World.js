function findThirdPosition(pos1, pos2, distance) {
	// Calculate the vector from pos1 to pos2
	const directionX = pos2.x - pos1.x
	const directionY = pos2.y - pos1.y

	// Normalize the direction vector
	const length = Math.sqrt(directionX * directionX + directionY * directionY)
	const normalizedDirectionX = directionX / length
	const normalizedDirectionY = directionY / length

	// Extend this direction by the specified distance to find the third position
	const extendedVectorX = normalizedDirectionX * distance
	const extendedVectorY = normalizedDirectionY * distance
	const pos3 = { x: pos2.x + extendedVectorX, y: pos2.y + extendedVectorY }

	return new Position(pos3.x, pos3.y)
}

export class World {
	constructor(level, camera, mouse, controller) {

		this.player = new Player(mouse)
		camera.followInstantly(this.player)
		controller.control(this.player)

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
		], () => {
			console.log('quest finished')
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
		const p = findThirdPosition(this.player, this.deliveryDrone, 100)
		draw.new_circle(p)

		this.localObjects.draw(draw, guiDraw)
	}
}
