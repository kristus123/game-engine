export class Piss {
	constructor(player, mouse, position) {

		this.inventory = new Inventory()

		for (let i = 0; i < 50; i++) {
			const x = Random.integerBetween(position.x, position.x + position.width)
			const y = Random.integerBetween(position.y, position.y + position.height)

			const p = Random.direction(new Position(x, y), 100)
			const piss = new GameObject(p.x, p.y, Random.integerBetween(1, 3), Random.integerBetween(1, 3), 200, 50)

			this.inventory.addPickable(piss)
		}
	}

	update() {
		RunOnce(this.inventory.size >= 1, () => {
			Call(this.onFinish)
		})
	}

	draw(draw) {

		this.inventory.draw(draw)

		const angle = 50 // rn it only works with 50
		draw.splash(this.player.position, this.mouse.position, angle)

		this.inventory.pickableItems.forEach(i => {
			if (Collision.between(this.player, i)) {
				this.inventory.pickUp(i)
			}

			if (Calculate.isObjectWithinTheAngle(i, this.player, this.mouse.position, angle) && Distance.between(i, this.player) < 500) {
				ForcePush(i).towards(this.player, 5)
			}

			if (Distance.between(i, this.player) < 100) {
				ForcePush(i).towards(this.player, 10)
			}
		})
	}
}
