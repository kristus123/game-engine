class ONE_DeliverChickens {
	constructor(chickens) {
		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100), chickens)
		this.p = QuestList.add('Deliver chickens to the new destination')
	}

	completed() {
		if (this.deliveryZone.amountDelivered == 2) {
			this.p.completed()
			return true
		} 
		else {
			return false
		}
	}

	update() {
		this.deliveryZone.update()
	}

	draw(draw, guiDraw) {
		this.deliveryZone.draw(draw, guiDraw)
	}
}

class TWO_DriveChickens {
	constructor(chickens, player) {

		const deliveryDrone = new DeliveryDrone(new Position(0, 0), player)
		this.p = QuestList.add('drive them to wacky mac!')

		this.cargo = new Cargo(chickens, deliveryDrone)

		this.deliveryZone = new DeliveryZone(new Position(1_000, 1_000, 100, 100), chickens)

		this.localObjects = new LocalObjects([
			deliveryDrone,
			this.deliveryZone,
			this.cargo,
		])
	}

	completed() {
		if (this.deliveryZone.amountDelivered == 2) {
			this.p.completed()
			return true
		}
		else {
			return false
		}
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

		QuestList.show()


		this.localObjects = new LocalObjects([
			new MovableObjects(player, chickens),
			new Quest([
				() => new ONE_DeliverChickens(chickens),
				() => new TWO_DriveChickens(chickens, player),
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
