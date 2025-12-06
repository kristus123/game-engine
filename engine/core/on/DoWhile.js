export class While {
	constructor(condition, action) {
	}

	update() {
		if (this.condition()) {
			this.action()
		}
	}
}
