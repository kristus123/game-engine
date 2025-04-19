export class OnChange {
	constructor(condition, action) {
		this.lastCondition = condition()
	}

	update() {
		const currentCondition = this.condition()

		if (this.lastCondition != currentCondition) {
		console.log("hei")
			this.action(currentCondition)
			this.lastCondition = currentCondition
		}
	}

	draw(draw, guiDraw) {
	}
}
