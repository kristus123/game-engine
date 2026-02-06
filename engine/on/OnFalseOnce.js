export class OnFalseOnce {
	constructor(condition, action) {
		Assert.method(condition)

		this.onChange = OnChange(condition, b => {
			if (!b) {
				action(b)
        		this.removeItself()
			}
		})
	}

	update() {
		this.onChange.update()
	}
}
