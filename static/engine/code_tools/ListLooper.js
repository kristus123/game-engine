export class ListLooper {
	constructor(list) {
		this.index = 0
	}

	goThrough(callback) {
		if (this.index < this.list.length) {

			const next = () => {
				this.index += 1
			}

			callback(this, index, this.list[this.index], next, false)
		}
		else {
			callback(-1, () => {}, () => {}, true)
		}
	}
}
