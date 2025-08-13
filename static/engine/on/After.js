export class After {
	constructor(intervalMs, action) {
		this.intervalMs = intervalMs
		this.action = action
		this.lastTrigger = performance.now()
	}

	update() {
		const now = performance.now()
		if (now - this.lastTrigger >= this.intervalMs) {
			this.action()
			this.lastTrigger = now
		}
	}

	draw(draw, guiDraw) {
		// optional rendering stuff
	}
}

