export class Piss {
	constructor(player, mouse, position) {
		this.inventory = new Inventory()
		this.player = player
		this.mouse = mouse
		this.firstTimeFinish = new FirstTimeFinish()

		for (let i = 0; i < 500; i++) {
			const x = Random.integerBetween(position.x, position.x + position.width)
			const y = Random.integerBetween(position.y, position.y + position.height)
			this.inventory.addPickable(
				new GameObject(x, y, Random.integerBetween(1,10), Random.integerBetween(1,10), 200, 50))
		}
	}

	get finished() {
		return this.inventory.size >= 450
	}

	onFinish() {
		console.log('override this')
	}

	update() {
		if (this.finished) {
			this.firstTimeFinish.setFinished()
			if (this.firstTimeFinish.finishedForTheFirstTime()) {
				this.onFinish()
			}
		}
	}

	draw(ctx) {
		this.inventory.draw(ctx)

		const angle = 50 // rn it only works with 50
		Draw.splash(ctx, this.player.position, this.mouse.position, angle)

		this.inventory.pickableItems.forEach(i => {
			if (Collision.between(this.player, i)) {
				this.inventory.pickUp(i)
			}

			if (Calculate.isObjectWithinTheAngle(i, this.player, this.mouse.position, angle) && Distance.between(i, this.player) < 500) {
				Push(i).towards(this.player, 5)
			}

			if (Distance.between(i, this.player) < 100) {
				Push(i).towards(this.player, 10)
			}
		})
	}
}
