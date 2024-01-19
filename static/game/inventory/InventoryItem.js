export class InventoryItem extends GameObject {
	constructor(x, y, inventory) {
		super(x, y, 35, 50, 100, 10)

		this.splash = new Splash()
		this.inventory = inventory
	}

	pickUp() {
		this.inventory.pickUp(this)
	}

	draw(draw) {
		if (!this.pickedUp) {
			super.draw(draw)
		}

		this.splash.draw(draw)
	}

}
