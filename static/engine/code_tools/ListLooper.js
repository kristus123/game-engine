export class ListLooper {
	constructor(list, callback= () => {}) {
		this.index = 0
	}

	get finished() {
		return !(this.index < this.list.length)
	}

	update() {
	}

	draw(draw, guiDraw) {
		if (!this.finished) {
			this.callback(
				this.list[this.index], // element
				() => this.index += 1, // next()
				this.finished,
				draw,
				guiDraw) 
		}
	}
}
