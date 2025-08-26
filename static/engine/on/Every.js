export class Every {
	constructor(intervalMs, action, maxRuns='infinite', onFinish=() => {}) {
		this.intervalMs = intervalMs
		this.action = action
		this.lastTrigger = performance.now()

		this.runs = 0
	}

	update() {
		if (this.maxRuns != 'infinite' && this.runs >= this.maxRuns) {
			this.onFinish()
			this.removeFromLoop()
		}
		else {
			const now = performance.now()
			if (now - this.lastTrigger >= this.intervalMs) {
				this.action()
				this.runs += 1
				this.lastTrigger = now
			}
		}
	}

	draw(draw) {
		// optional rendering stuff
	}
}

