export class TaskQueue {
	constructor() {
		this.queue = []
		this.running = false
	}

	async add(taskFn) {
		this.queue.push(taskFn)

		if (!this.running) {
			this.running = true

			while (this.queue.length) {
    			const task = this.queue.shift()
    			await task()
			}

			this.running = false
		}
	}
}
