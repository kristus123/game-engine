export class PromiseQueue {

	constructor() {
		this.promise = Promise.resolve()
	}

	add(callback) {
		this.promise = this.promise.then(callback)

		return this
	}
}

