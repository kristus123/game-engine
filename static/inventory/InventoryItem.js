export class InventoryItem extends GameObject {
	constructor() {
		super(-100, 0, 35, 50, 100, 10)

		this.splash = new Splash()
	}

	pickUp() {
		this.pickedUp = true

	}

	draw(ctx) {
		if (!this.pickedUp) {
			super.draw(ctx)
		}

		this.splash.draw(ctx)
	}

}
