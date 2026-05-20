export class IntegerLoop {
	constructor(start, end) {
		this.value = start
	}

	next() { // todo find out if it is properly showing all frames, but for now this is ok
		this.value += 1
		if (this.value -1 >= this.end + 1) {
			this.value = 0
		}

	}

	get value() {
		return this.value
	}
}
