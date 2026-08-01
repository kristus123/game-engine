export class OnTrue {
	constructor(condition, action) {
		Assert.method(condition)

		this.onChange = OnChange(condition, b => {
			if (b) {
				const onFalse = (run) => {
					this.addToSame(OnFalseOnce(condition, run))
				}
				action(onFalse)
			}
		})
	}

	update() {
		this.onChange.update()
	}
}
