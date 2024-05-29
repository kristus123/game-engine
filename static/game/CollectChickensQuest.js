export class CollectChickensQuest {
	constructor(mouse, player, chickens) {

		this.movableObjects = new MovableObjects(mouse, player, chickens)
		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100), chickens)

		this.localObjects = new LocalObjects([
			this.movableObjects,
			this.deliveryZone,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}