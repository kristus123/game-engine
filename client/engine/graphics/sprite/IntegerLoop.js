export class IntegerLoop {
	constructor(start, end) {
		this.current = start
	}

	next() { // todo find out if it is properly showing all frames, but for now this is ok
		this.current += 1
		if (this.current -1 >= this.end + 1) {
			this.current = 0
		}

	}

	get value() {
		return this.current
	}
}
