class ONE_DeliverChickens {
	constructor( camera, player) {
		this.chickens = [
			new Chicken(new Position(0, 0)),
			new Chicken(new Position(-100, 0)),
			new Chicken(new Position(-100, 0)),
			new Chicken(new Position(-100, 0)),
		]

		this.movableObjects = new MovableObjects(player, this.chickens)
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

class TWO_DriveChickens {
	constructor(camera, player) {
		this.chickens = [
			new Chicken(new Position(0, 0)),
			new Chicken(new Position(-100, 0)),
		]

		this.deliveryDrone = new DeliveryDrone(new Position(2000, 2000), player, camera)
		this.movableObjects = new MovableObjects( player, this.chickens)
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


export function FirstQuest(camera, player) {
	return new Quest([
		new ONE_DeliverChickens( camera, player),
	], () => {
		console.log('quest finished')
	})

}
