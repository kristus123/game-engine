export class Queue {
	static {
		this.global = new Queue()
	}

	constructor() {
		this.queue = []
		this.running = false
	}

	add(taskFn) {
		this.queue.push(taskFn)
		if (!this.running) {
			this._processNextTask()
		}
		return this
	}

	async _processNextTask() {
		if (this.queue.length === 0) {
			this.running = false
			return
		}
		this.running = true
		const task = this.queue.shift()
		try {
			await task()
		} catch (e) {
			console.error("Queue task error:", e)
		}
		this._processNextTask()
	}
}
