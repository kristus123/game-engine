export class ListLooper {
	constructor(list) {
		this.index = 0
	}

	run(callback) {
		if (this.index < this.list.length) {
			const finished = this.index === this.list.length - 1

			const next = () => {
				this.index += 1
			}

			callback(this.list[this.index], next, finished)
		}
		else {
			callback(null, null, true) // Indicate that we're finished
		}
	}
}
