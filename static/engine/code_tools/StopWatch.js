export class StopWatch {
	constructor() {
		this.startTime = 0
		this.endTime = 0
		this.running = false
		this._elapsedTime = 0
	}

	start() {
		this.startTime = Date.now() - this._elapsedTime
		this.running = true
	}

	stop() {
		this.endTime = Date.now()
		this._elapsedTime = this.endTime - this.startTime
		this.running = false
	}

	reset() {
		this.startTime = 0
		this.endTime = 0
		this.running = false
		this._elapsedTime = 0
	}

	get elapsedTime() {
		if (this.running) {
			return Date.now() - this.startTime
		}
		else {
			return this._elapsedTime
		}
	}

}

