export class InfiniteListLooper {
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
		callback(this.list[this.index], this.next)

		if (this.finished) {
			this.index = 0
		}
	}
}
