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
		this.player = player

		this.p = QuestList.add('drive them to wacky mac!')

		this.deliveryZone = new DeliveryZone(new Position(1_000, 1_000, 100, 100), chickens)

		this.localObjects = new LocalObjects([
			deliveryDrone,
			this.deliveryZone,
			new Cargo(chickens, deliveryDrone),
			this.npc,
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
		if (Distance.within(100, this.npc, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.npc, 'come closer dude')
		}

	draw(draw, guiDraw) {
		if (Distance.within(100, this.npc, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.npc, 'come closer dude')
		}

	draw(draw, guiDraw) {
		if (Distance.within(100, this.npc, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.npc, 'come closer dude')
		}

	draw(draw, guiDraw) {
		if (Distance.within(100, this.npc, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.npc, 'come closer dude')
		}

	draw(draw, guiDraw) {
		if (Distance.within(100, this.npc, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
		}
		else {
			draw.text(this.npc, 'come closer dude')
		}

		this.localObjects.draw(draw, guiDraw)
	}
}

export class FirstQuest {
	constructor(player) {
		const chickens = [
			new Chicken(new Position(0, 0)),
			new Chicken(new Position(-200, 0)),
			new Chicken(new Position(-400, 0)),
			new Chicken(new Position(-100, 0)),
		]

		for (const c of chickens) {
			player.gun.hittableObjects.push(c)
		}

		// QuestList.show()

		this.localObjects = new LocalObjects([
			//new MovableObjects(player, chickens),
			new Quest([
				//() => new ONE_DeliverChickens(chickens),
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
