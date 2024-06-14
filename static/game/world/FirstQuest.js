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


		const npc = new Npc(new Position(1_000, 1_000, 20, 20))
		this.npc = npc
		const text = new MultiTextTyper(npc.position.offset(0, -20), [
			"welcome!",
			"time to get to work",
		])
		this.text = text

		this.localObjects = new LocalObjects([
			deliveryDrone,
			this.deliveryZone,
<<<<<<< HEAD
			new Cargo(chickens, deliveryDrone),
			this.npc,
=======
			this.cargo,
			npc,
			text,
>>>>>>> a5dc881 (x)
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
		if (Distance.within(100, this.npc, this.player)) {
			this.text.update()
			this.text.draw(draw, guiDraw)
			
		}
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
<<<<<<< HEAD
				//() => new ONE_DeliverChickens(chickens),
				() => new TWO_DriveChickens(chickens, player),
			]),
=======
				() => new ONE_DeliverChickens(chickens),
				() => new TWO_DriveChickens(chickens, player),
			], () => {
				Level.change(new InsideWackyMac(player))
			}),
>>>>>>> a5dc881 (x)
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
