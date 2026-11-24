export default class AsyncLock {
	constructor() {
		this.locked = false
	}

	async run(callback) {
		if (this.locked) return

		this.locked = true

		try {
			return await callback()
		}
		finally {
			this.locked = false
		}
	}
}
