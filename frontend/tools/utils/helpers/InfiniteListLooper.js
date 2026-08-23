export class InfiniteListLooper {
	constructor(list) {
		this.index = 0
	}

	next() {
		this.index += 1
	}

	get done() {
		return !(this.index < this.list.length)
	}

	goThrough(callback) {
		callback(this.list[this.index], this.next)

		if (this.done) {
			this.index = 0
		}
	}
}
