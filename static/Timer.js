class Timer {
	constructor() {
		this.timeLeft = 400
	}

	isTime() {
		return this.timeLeft < 0
	}

	draw(ctx) {
		
	}

	update() {
		this.timeLeft -= 1
	}
	
}
