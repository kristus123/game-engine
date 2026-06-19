export class Task {
	constructor(name, { onStart, onUpdate, markDoneIf, markDoneIfMoreThanMs } = {}) {
		this.done = false
		this.stopWatch = StopWatch()
		this.started = false
	}

	markDone() {
		this.done = true
		this.stopWatch.stop()
	}

	start() {
		this.started = true
		this.onStart?.()
		this.stopWatch.start()
	}

	update() {
		if (this.done) {
			// finished running logic
		}
		else {
			this.onUpdate?.()

			if (this.markDoneIf?.()) {
				this.markDone()
			}
			else if (this.markDoneIfMoreThanMs && this.duration >= this.markDoneIfMoreThanMs) {
				this.markDone()
			}

			if (this.done) {
				onDone?.()
			}
		}
	}

	get duration() {
		return this.stopWatch.ms
	}
}
