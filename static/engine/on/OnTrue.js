// 'new' is prefixed in transpiler, just write OnTrue(...)

export class OnTrue {
	constructor(condition, action) {
		// todo verify condition is a lambda
		this.onChange = OnChange(condition, b => {
			if (b) {
				action(b)
			}
		})
	}

	update() {
		this.onChange.update()
	}

	draw() {
		this.onChange.draw()
	}
}
