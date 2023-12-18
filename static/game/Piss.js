export class Piss {
	constructor(player, mouse) {
		this.inventory = new Inventory()
		this.player = player
		this.mouse = mouse

		for (let i = 0; i < 100; i++) {
			this.inventory.addPickable(new GameObject(Random.integerBetween(-100, 100), Random.integerBetween(-100, 100), 10, 10, 50, 200))
		}

	}

	update() {
		
	}


	draw(ctx) {
		this.inventory.draw(ctx)

		this.inventory.pickableItems.forEach(i => {
			if (Collision.between(this.player, i)) {
				this.inventory.pickUp(i)
			}

			if (Draw.isObjectWithinTheAngle(i, this.player, this.mouse.position, 200) && this.mouse.down) {
				Push(i).towards(this.player, 2)
				// Draw.new_text(ctx, i.position, 'heiiiiiiiiiiiiiiiiiiiiiiiiiii')
			}
			else {
				// Draw.new_text(ctx, i.position, 'point at me')
			}

		})
		
	}
}
