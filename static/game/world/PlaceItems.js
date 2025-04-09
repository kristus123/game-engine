export class PlaceItems {
	constructor(items, placeDown= p => {}) {
		//pseudo code
		if (Array(items)) {
			this.itemsToPlace = new ListLooper(items)
		}
		else {
			this.itemsToPlace = new ListLooper([items])
		}
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.itemsToPlace.goThrough(i => {
			i.x = Mouse.position.x
			i.y = Mouse.position.y

			if (Mouse.timeSinceLastClick > 20) {
				draw.transparentGreenRectangle(i)
			}
			else {
				draw.transparentRedRectangle(i)
			}

			i.draw(draw, guiDraw)

			if (Mouse.click(i)) {
				this.placeDown(i)
				this.itemsToPlace.next()
			}
		})

		if (this.itemsToPlace.finished) {
			this.removeFromLoop()
		}
	}

}
