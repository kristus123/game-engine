export class PlaceItems {
	constructor(itemsToPlace, placeDown= p => {}) {
		this.itemsToPlace = new ListLooper(itemsToPlace)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.itemsToPlace.goThrough(i => {
			console.log('hei')
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
