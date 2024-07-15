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

		const p = o.position.copy()
		p.y -= 100

		this.splash.splash(o, p, 10, 'yellow')
	}

	get size() {
		return this.inventory.length
	}

	draw(draw, guiDraw) {
		this.pickableItems.forEach(i => {
			i.draw(draw, guiDraw)
		})

		this.splash.draw(draw, guiDraw)
	}

}
