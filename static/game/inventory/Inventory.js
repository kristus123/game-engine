export class Inventory {
	constructor() {
		this.inventory = []
		this.pickableItems = []

		this.splash = new Splash()
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
	}

	get size() {
		return this.inventory.length
	}

	draw(ctx) {
		this.pickableItems.forEach(i => {
			i.draw(ctx)
		})

		this.splash.draw(ctx)
	}
	
}
