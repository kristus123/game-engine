export class ListLooper {
	constructor(list, callback= () => {}) {
		this.index = 0
	}

	completed() {
		return !(this.index < this.list.length)
	}

	update() {
		console.log('don\'t call update while using ListLooper!')
	}

	draw() {
		if (!this.completed()) {
			this.callback(
				this.list[this.index], // element
				() => this.index += 1, // next()
				this.completed(),
				Draw)
		}
	}
}
