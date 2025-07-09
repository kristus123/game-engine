import { AnArray } from '/static/engine/assertions/AnArray.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { ListLooper } from '/static/engine/code_tools/ListLooper.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 

export class PlaceItems {
	constructor(items, placeDown= p => {}) {

				AssertNotNull(items, "argument items in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(placeDown, "argument placeDown in " + this.constructor.name + ".js should not be null")
			
		this.items = items; 
		this.placeDown = placeDown; 

		if (AnArray(items)) {
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

			if (Mouse.timeSinceLastClick > 50) {
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
