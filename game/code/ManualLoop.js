export class ManualLoop {
	constructor(run) {
		this.i = 0
		this.ready = true
		this.x = () => {}
	}

	onFinish(xx) {
		this.x = xx
		return this
	}

	update() {
		if (this.ready) {
			this.ready = false
			this.run(this.i, () => this.ready = true, () => {
    			this.x(this.i)
    			this.removeItself()
			})
			this.i += 1
		}
	}
}