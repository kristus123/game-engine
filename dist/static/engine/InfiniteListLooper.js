import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class InfiniteListLooper {
	constructor(list) {

				AssertNotNull(list, "argument list in " + this.constructor.name + ".js should not be null")
			
		this.list = list; 

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
