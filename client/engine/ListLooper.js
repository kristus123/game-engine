export class ListLooper {
	constructor(list, callback= () => {}, onFinish = () => {}) {
		this.index = 0
	}

	update() {
		const completed = !(this.index < this.list.length)
		if (!completed) {
			this.callback(
				this.list[this.index], // element
				() => this.index += 1) // next()
		}
		else {
			this.onFinish()
		}
	}

}
