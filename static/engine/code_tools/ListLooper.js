export class ListLooper {
	constructor(list, callback= () => {}) {
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
