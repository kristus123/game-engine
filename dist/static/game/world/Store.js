import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class Store {
	constructor() {


		this.localObjects = new LocalObjects()

		Html.upper([
			Html.button('hey', () => {
			}),
			Html.button('hey', () => {
			}),
			Html.button('hey', () => {
			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
