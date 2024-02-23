export class Steps {
	constructor() {
		this.steps = []
		this.index = 0
		this.lock = false

		this._loop = false
	}

	once(run) {
		if (!this.lock) {
			this.steps.push(() => {
				run()
				return true
			})
		}

		return this
	}

	wait(milliseconds) {
		if (!this.lock) {

			let c = false
			setTimeout(() => {
				c = true
			}, milliseconds)

			this.steps.push(() => {
				return c
			})
		}

		return this
	}

	until(run) {
		if (!this.lock) {
			this.steps.push(run)
		}

		return this
	}

	loop() {
		this._loop = true

		return this
	}

	update() {
		if (this.steps.length != 0) {
			this.lock = true
		}

		if (List.validIndex(this.steps, this.index)) {
			const f = this.steps[this.index]

			if (f()) {
				this.index += 1
			}
		}
		else if (this._loop) {
			this.steps = []
			this.index = 0
			this.lock = false
		}

		return this
	}
}
