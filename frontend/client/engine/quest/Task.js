// to be used in quest.js

export class Task {
	constructor(name, config = {}) {
		const { start, onDone, markDoneIf, markDoneIfMoreThanMs } = config

		this.done = false
		this.stopWatch = StopWatch()
		this.started = false

		this.onDone = onDone
		this.markDoneIf = markDoneIf
		this.markDoneIfMoreThanMs = markDoneIfMoreThanMs

		this.onUpdate = () => {}

		this.start = () => {
			if (start) {
				const result = start(() => this.markDone())
				if (result && typeof result.update == "function") {
					this.onUpdate = () => result.update()
				}
			}

			this.started = true
			this.stopWatch.start()
		}
	}

	markDone() {
		this.done = true
		this.stopWatch.stop()

		this.onDone?.()
	}

	get active() {
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
