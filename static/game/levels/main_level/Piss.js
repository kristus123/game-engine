export class Piss {
	constructor(player, mouse, position) {

		this.inventory = new Inventory()

		for (let i = 0; i < 100; i++) {
			const x = Random.integerBetween(position.x, position.x + position.width)
			const y = Random.integerBetween(position.y, position.y + position.height)

			const p = Random.direction(new Position(x, y), 100)
			const piss = new DynamicGameObject(new Position(p.x, p.y, Random.integerBetween(1, 3), Random.integerBetween(1, 3)), 200, 20)

			this.inventory.addPickable(piss)
		}
	}

	update() {
		RunOnce(this.inventory.size >= 1, () => {
			Call(this.onFinish)
		})
	}

	draw(draw, guiDraw) {

		this.inventory.draw(draw, guiDraw)

		this.inventory.pickableItems.forEach(i => {
			if (Distance.between(i, this.player.position.center) < 50) {
				this.inventory.pickUp(i)
			}

			if (Distance.between(i, this.player) < 200) {
				ForcePush(i).towards(this.player.position.center, 10)
			}
		})
	}
}
