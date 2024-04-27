export class InventoryItem extends DynamicGameObject {
	constructor(x, y, inventory) {
		super(x, y, 35, 50, 100, 10)

		this.splash = new Splash()
		this.inventory = inventory
	}

	pickUp() {
		this.inventory.pickUp(this)
	}

	draw(draw, guiDraw) {
		if (!this.pickedUp) {
			super.draw(draw, guiDraw)
		}

		this.splash.draw(draw, guiDraw)
	}

}
