export class FirstTimeFinish {
	constructor(predicate) {
		this.predicate = predicate

		this.finished = false
		this.returnedTrueOnce = false
	}

	returnTrueIfFinishedOnce() {
		if (this.predicate()) {
			this.finished = true

			if (this.finished && !this.returnedTrueOnce) {
				this.returnedTrueOnce = true
				return true
			}
			else {
				return false
			}
		}
		else {
			return false
		}
	}
}
