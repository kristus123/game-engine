export class FirstTimeFinish {
	constructor() {
		this.finished = false
		this.returnedTrueOnce = false
	}

	setFinished() {
		this.finished = true
	}

	finishedForTheFirstTime() {
		if (this.finished && !this.returnedTrueOnce) {
			this.returnedTrueOnce = true
			return true
		}
		else {
			return false
		}
	}
}
