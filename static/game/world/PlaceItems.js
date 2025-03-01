export class PlaceItems {
	constructor(itemsToPlace, placeDown= p => {}) {
	}

	update() {
	}

	draw(draw, guiDraw) {
		if (this.itemsToPlace.length > 0) {
			const i = this.itemsToPlace[0]
			i.x = Mouse.position.x
			i.y = Mouse.position.y

			draw.transparentGreenRectangle(i)

			if (Mouse.down) {
				this.placeDown(i)
				List.remove(this.itemsToPlace, i)
				this.removeFromLoop()
			}
		}
	}

}
