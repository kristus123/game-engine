import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/graphics/ui/html/Html.js'; 
import { Position } from '/static/engine/position/Position.js'; 

const texts = []

export class Text {
	constructor(position, text) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(text, "argument text in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.text = text; 

		this.t = Html.floating(Html.text(text), position)

		texts.push(this)
	}

	static updateAll() {
		for (const t of texts) {
			Html.floatingPosition(t.t, t.position)
		}
	}

	show() {
		Html.show(this.t)
	}

	hide() {
		Html.hide(this.t)
	}

	draw(draw, guiDraw) {
	}
}
