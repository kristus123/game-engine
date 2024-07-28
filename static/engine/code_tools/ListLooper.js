export class ListLooper {
	constructor(list) {
		this.index = 0
	}

	next() {
		this.index += 1
	}

	get finished() {
		return !(this.index < this.list.length)
	}

	goThrough(callback) {
		if (!this.finished) {
			callback(this.list[this.index])
		}
	}
}
