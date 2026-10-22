export class Game {

	static onNextYearListener = new Listener()

	static year = 0

	static actionsTaken = 0
	static newActionTakenListener = new Listener()

	static increment() {
		this.year += 1
		this.onNextYearListener.trigger(this.year)
	}

	static onNextYear(callback) {
		this.onNextYearListener.listen(callback)
	}

	static newActionTaken() {
		this.actionsTaken += 1
		this.newActionTakenListener.trigger(this.actionsTaken)
	}

	static onNewActionTaken(callback) {
		this.newActionTakenListener.listen(callback)
	}

	static get maxActionsTaken() {
		if this.actionsTaken == 4 {
			return true
		}
		else if this.actionsTaken > 4 {
			throw new Error("this should never happen")
		}
	}

}
