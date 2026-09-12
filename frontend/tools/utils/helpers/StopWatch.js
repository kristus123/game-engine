export class StopWatch {

	constructor() {
		this.startTime = 0
		this.endTime = 0
		this.running = false
		this._elapsedTime = 0

		this.start()
	}

	start() {
		this.startTime = Date.now() - this._elapsedTime
		this.running = true

		return this
	}

	stop() {
		this.endTime = Date.now()
		this._elapsedTime = this.endTime - this.startTime
		this.running = false
		return this
	}

	reset() {
		this.startTime = 0
		this.endTime = 0
		this.running = false
		this._elapsedTime = 0
		return this
	}

	restart() {
		this.reset()
		this.start()
		return this
	}

	get time() { // returns ms
		if (this.running) {
			return Date.now() - this.startTime
		}
		else {
			return this._elapsedTime
		}
	}

	get ms() {
		return this.time
	}

	moreThan(ms) {
		return this.running && this.ms >= ms
	}

	get value() { // returns ms
		return this.time // used in motion
	}

	get mmss() {
		const totalSeconds = Math.floor(this.time / 1000)
		const minutes = Math.floor(totalSeconds / 60)
		const seconds = totalSeconds % 60

		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
	}

	get hhmmss() {
		const totalSeconds = Math.floor(this.time / 1000)
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor(totalSeconds / 60) % 60
		const seconds = totalSeconds % 60

		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
	}

}

