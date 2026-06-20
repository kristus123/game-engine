export class Task {
	constructor(name, { name, start, onDone, markDoneIf, markDoneIfMoreThanMs } = {}) {
		this.done = false
		this.stopWatch = StopWatch()
		this.started = false

		this.onUpdate = () => {}

		this.start = () => {
			const {update} = start(() => this.markDone())
			this.onUpdate = () => update()

			this.started = true
			this.stopWatch.start()
		}
	}

	markDone() {
		this.done = true
		this.stopWatch.stop()

		this.onDone?.()
	}

	active() { // maybe not needed to be its own method
		return this.started && !this.done
	}

	update() {
		if (this.active) {
			this.onUpdate()

			if (this.markDoneIf?.()) {
				this.markDone()
			}
			else if (this.markDoneIfMoreThanMs && this.duration >= this.markDoneIfMoreThanMs) {
				this.markDone()
			}
		}
	}

	get duration() {
		return this.stopWatch.ms
	}
}
