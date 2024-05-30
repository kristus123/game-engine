export class CollectChickensQuest {
	constructor(mouse, player, chickens) {
		this.chickens = [
			new Chicken(new Position(0, 0)),
			new Chicken(new Position(-100, 0)),
			new Chicken(new Position(-100, 0)),
			new Chicken(new Position(-100, 0)),
		]

		this.movableObjects = new MovableObjects(mouse, player, this.chickens)
		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100), this.chickens)

		this.localObjects = new LocalObjects([
			...this.chickens,
			this.movableObjects,
			this.deliveryZone,
		])
	}

	completed() {
		return this.deliveryZone.amountDelivered == 2
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
