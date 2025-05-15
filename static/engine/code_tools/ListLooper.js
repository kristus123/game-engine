export class ListLooper {
	constructor(list, callback= () => {}) {
		this.index = 0
	}

	get finished() {
		return !(this.index < this.list.length)
	}

	update() {
		if (!this.finished) {
			this.callback(
				this.list[this.index],
				() => this.index += 1,
				this.finished)
		}
	}

	draw(draw, guiDraw) {
	}
}
