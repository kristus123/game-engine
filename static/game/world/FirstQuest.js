class ONE_DeliverChickens {
	constructor(player, chickens) {

		this.deliveryZone = new DeliveryZone(new Position(-1_000, 0, 100, 100), this.chickens)

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

class TWO_DriveChickens {
	constructor(player, chickens) {
		this.deliveryZone = new DeliveryZone(new Position(1_000, 1_000, 100, 100), chickens)

		this.localObjects = new LocalObjects([
			this.deliveryZone,
			new Npc(new Position(0,0)),
			new DeliveryDrone(new Position(0, 0), player),
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
		this.chickens = [
			new Chicken(new Position(0, 0)),
			new Chicken(new Position(-100, 0)),
		]
		this.movableObjects = new MovableObjects(player, this.chickens)

		this.quest = new Quest([
			new ONE_DeliverChickens(player, this.chickens),
			new TWO_DriveChickens(player, this.chickens),
		], () => {
			console.log('quest finished')
		})
		
	}

	update() {
		this.quest.update()
		this.movableObjects.update()
	}

	draw(draw, guiDraw) {
		this.quest.draw(draw, guiDraw)
		this.movableObjects.draw(draw, guiDraw)

		for (const c of this.chickens) {
			c.update
			c.draw(draw, guiDraw)
		}
	}
}
