export class AsyncLock {
	constructor() {
		this.locked = false
	}

	async run(callback) {
		if (this.locked) {
			return // do nothing
		}
		else {
			this.locked = true

			try {
				return await callback()
			}
			finally {
				this.locked = false
			}
		}
	}
}
