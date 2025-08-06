export class PickUp {
	constructor(items, onPickUp=(e) => {}) {

		KeyDown('e', () => {
			if (this.holding) {
				this.holding = null
			}
			else {
				const closestItem = G.player.touchesAny(this.items)
				if (closestItem && !this.holding && Keyboard.e) {
					this.holding = closestItem
					this.onPickUp(this.holding)
				}
			}
		})
	}

	drop() {
		this.holding = null
	}

	update() {
		if (this.holding) {
			this.holding.position.x = G.player.position.x + 20
			this.holding.position.y = G.player.position.y - 10
		}
	}

	draw(draw, guiDraw) {
		const item = G.player.touchesAny(this.items)

		if (item && !this.holding) {
			draw.text(item, 'e to pick up')
		}
	}
}
