// 'new' is prefixed in transpiler, just write OnChange(...)

export class OnChange {
	constructor(condition, action) {
		this.lastCondition = condition()
	}

	update() {
		const currentCondition = this.condition()

		if (this.lastCondition != currentCondition) {
			this.action(currentCondition)
			this.lastCondition = currentCondition
		}
	}

	draw(draw, guiDraw) {
	}
}
