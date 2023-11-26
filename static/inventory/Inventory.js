export class Inventory {
	constructor() {
		this.inventory = []
		this.pickableItems = []

		this.splash = new Splash()
	}

	addPickable(o) {
		this.pickableItems.push(o)
	}

	pickUp(o) {
		this.inventory.push(o)
		List.remove(this.pickableItems, o)

		this.splash.splash(o, {
			x: o.x,
			y: o.y - 100,
		}, 10, 'orange')

		o.x = -1000
	}

	draw(ctx) {
		this.pickableItems.forEach(i => {
			i.draw(ctx)
		})

		this.splash.draw(ctx)
	}
	
}
