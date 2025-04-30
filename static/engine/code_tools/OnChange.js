export class OnChange {
	constructor(condition, action) {
		this.lastCondition = condition()
	}

	update() {
		const currentCondition = this.condition()
		console.log(currentCondition)

		if (this.lastCondition != currentCondition) {
			this.action(currentCondition)
			this.lastCondition = currentCondition
		}
	}

	draw(draw, guiDraw) {
	}
}
