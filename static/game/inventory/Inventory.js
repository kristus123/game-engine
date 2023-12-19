export class Inventory {
	constructor() {
		this.inventory = []
		this.pickableItems = []

		this.splash = new Splash()

		this.score = 0
	}

	addPickable(o) {
		console.log('added pickable itesm')
		this.pickableItems.push(o)
		console.log(this.pickableItems.length)
	}

	pickUp(o) {
		this.inventory.push(o)
		List.remove(this.pickableItems, o)

		const p = o.position.copy()
		p.y -= 100

		this.splash.splash(o, p, 10, 'yellow')

		this.score++
	}

	draw(ctx) {
		this.pickableItems.forEach(i => {
			i.draw(ctx)
		})

		this.splash.draw(ctx)
	}
	
}
