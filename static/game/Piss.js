export class Piss {
	constructor(player, mouse) {
		this.inventory = new Inventory()
		this.player = player
		this.mouse = mouse

		for (const area of [0]) {
			for (let i = 0; i < 1; i++) {
				const x = Random.integerBetween(-area, area)
				const y = Random.integerBetween(-area, area)
				this.inventory.addPickable(new GameObject(x, y, 10, 10, 200, 50))
			}
		}
	}

	update() {
		console.log(this.inventory.pickableItems.length)
	}


	draw(ctx) {
		this.inventory.draw(ctx)

		this.inventory.pickableItems.forEach(i => {
			if (Collision.between(this.player, i)) {
				this.inventory.pickUp(i)
			}

			if (Draw.lookingAtObject(i, this.player, this.mouse.position, 50)) {
				// Push(i).towards(this.player, 5)
				Draw.new_text(ctx, i.position, '!')
			}
		})
		
	}
}
