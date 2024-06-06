class ONE_DeliverChickens {
	constructor(chickens) {
		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100), chickens)
	}

	completed() {
		return this.deliveryZone.amountDelivered == 2
	}

	update() {
		this.deliveryZone.update()
	}

	draw(draw, guiDraw) {
		this.deliveryZone.draw(draw, guiDraw)
	}
}

class TWO_DriveChickens {
	constructor(chickens) {
		this.deliveryZone = new DeliveryZone(new Position(1_000, 1_000, 100, 100), chickens)

		this.localObjects = new LocalObjects([
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

export class FirstQuest {
	constructor(player) {
		const chickens = [
			new Chicken(new Position(0, 0)),
			new Chicken(new Position(-100, 0)),
		]

		this.localObjects = new LocalObjects([
			new DeliveryDrone(new Position(0, 0), player),
			new MovableObjects(player, chickens),
			new Quest([
				new ONE_DeliverChickens(chickens),
				new TWO_DriveChickens(chickens),
			]),
			...chickens,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
