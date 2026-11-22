export class Queue {
	constructor(queue=[]) {
		this.running = false
		this.onEnd = () => {}
	}

	add(task) {
		this.queue.push(task)
		return this
	}

	addAndStart(task) {
		this.queue.push(task)

		if !this.running {
			this.start()
		}

		return this
	}

	start() {
		if this.running {
			throw new Error("WorkerQueue is already running")
		}
		else if this.queue.length == 0 {
			throw new Error("WorkerQueue is empty")
		}
		else {
			this.running = true
			this._processNextTask()
		}

		return this
	}

	onEnd(callback) {
		this.onEnd = callback

		return this
	}

	_processNextTask() {
		const task = this.queue.shift()

		task(() => {
			console.log("finished")
			if !this.running {
				throw new Error("WorkerQueue.next() called when the queue is not running")
			}
			else if this.queue.empty {
				this.onEnd()
				this.running = false
			}
			else {
				console.log("hei")
				this._processNextTask()
			}
		})
	}
}
