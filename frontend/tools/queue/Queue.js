export class Queue {
	constructor(queue=[]) {
    	this.running = false
	}

	add(task) {
    	this.queue.push(task)
    	return this
	}

	start(onEnd = () => {}) {
    	if (this.running) {
        	throw new Error("WorkerQueue is already running")
    	}
		else if (this.queue.length == 0) {
        	throw new Error("WorkerQueue is empty")
    	}
		else {
			this.running = true
			this.processNextTask(onEnd)
		}
	}

	processNextTask(onEnd) {
		const task = this.queue.shift()

		task(() => {
			console.log("finished")
			if (!this.running) {
				throw new Error("WorkerQueue.next() called when the queue is not running")
			}
			else if (this.queue.empty) {
				onEnd()
				this.running = false
			}
			else {
				console.log("hei")
				this.processNextTask(onEnd)
			}
		})
	}
}
