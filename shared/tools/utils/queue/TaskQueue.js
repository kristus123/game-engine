export class TaskQueue {
	static {
		this.global = new TaskQueue()
	}

	constructor() {
		this.tasks = []
		this.isProcessing = false
	}

	add(task) {
		return new Promise((resolve, reject) => {
			this.tasks.push(async () => {
    			try {
        			resolve(await task())
    			}
    			catch (e) {
        			reject(e)
    			}
			})
			this.process()
		})
	}

	async process() {
		if (this.isProcessing || this.tasks.length == 0) {
			return
		}
		this.isProcessing = true

		while (this.tasks.length > 0) {
			const task = this.tasks.shift()
			await task()
		}

		this.isProcessing = false
	}
}
