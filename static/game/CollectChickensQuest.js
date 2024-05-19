export class CollectChickensQuest {
	constructor(player, chickens) {

		this.movableObjects = new MovableObjects(player, chickens)
		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100))

		this.runAll = new RunAll([
			this.movableObjects,
			this.deliveryZone,
		])
	}

	update() {
		this.runAll.update()

		if (this.movableObjects.holding && this.deliveryZone.inside(this.movableObjects.holding)) {
			this.movableObjects.holding = null
		}
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
