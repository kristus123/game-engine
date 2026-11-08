export class PromiseQueue {

	constructor() {
		this.promise = Promise.resolve()
	}

	add(callback) {
		const result = this.promise.then(callback)
		this.promise = result.catch(() => {})
		return result
	}
}

