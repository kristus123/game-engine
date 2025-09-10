export class DeltaTime {
	static {
		this.stopwatch = new StopWatch()
		this.lastTime = this.stopwatch.time
		this.delta = 0
	}

	static update() {
		const currentTime = this.stopwatch.time
		this.delta = (currentTime - this.lastTime) / 1000
		this.lastTime = currentTime

		return this.delta
	}

	static reset() {
		this.stopwatch.reset()
		this.lastTime = 0
		this.delta = 0
		return this
	}

	static restart() {
		this.stopwatch.restart()
		this.lastTime = 0
		this.delta = 0
		return this
	}

	static get value() {
		return this.delta
	}

	static get fps() {
		return this.delta > 0 ? 1 / this.delta : 0
	}
}

