export class CollectChickensQuest {
	constructor(player, chickens) {

		this.movableObjects = new MovableObjects(player, chickens)
		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100), chickens)

		this.localObjects = new LocalObjects([
			this.movableObjects,
			this.deliveryZone,
		])
	}

	update() {
		this.localObjects.update()

		if (this.movableObjects.holding && this.deliveryZone.inside(this.movableObjects.holding)) {
			this.movableObjects.holding = null
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
