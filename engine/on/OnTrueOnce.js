export class OnTrueOnce {
	constructor(condition, action) {
		this.onTrue = OnTrue(condition, b => {
			if (b) {
				action(b)
    			this.removeItself()
			}
		})
	}

	update() {
		this.onTrue.update()
	}
}
