import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class ListLooper {
	constructor(list, callback= () => {}) {

				AssertNotNull(list, "argument list in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(callback, "argument callback in " + this.constructor.name + ".js should not be null")
			
		this.list = list; 
		this.callback = callback; 

		this.index = 0
	}

	completed() {
		return !(this.index < this.list.length)
	}

	update() {
	}

	draw(draw, guiDraw) {
		if (!this.completed()) {
			this.callback(
				this.list[this.index], // element
				() => this.index += 1, // next()
				this.completed(),
				draw,
				guiDraw)
		}
	}
}
