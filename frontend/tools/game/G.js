export class G {
	// year
	static _year = ValueListener(0)

	static get year() {
		return this._year.value
	}

	static onYear(callback) {
		this._year.listen(callback)
	}

	static incrementYear() {
		this._year.value += 1
		this.actionsTaken = 0
		this.newActionTakenListener.trigger(this.actionsTaken)
	}
	// year

	// wood
	static _wood = ValueListener(0)

	static get wood() {
		return this._wood.value
	}

	static set wood(y) {
		this._wood.value = y
	}

	static onWood(callback) {
		this._wood.listen(callback)
	}
	// wood

	// actions
	static actionsTaken = 0
	static newActionTakenListener = new Listener()

	static chopWood() {
		this.wood += 1
		this.newActionTaken()
		FloatingHtml.add(`
			<div style="color: white; font-size: 30px;">
				+1 wood
			</div>
		`.toHtml())
	}

	static newActionTaken() {
		this.actionsTaken += 1
		this.newActionTakenListener.trigger(this.actionsTaken)

		if this.maxActionsTaken {
			this.incrementYear()
		}
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
	// actions

}
