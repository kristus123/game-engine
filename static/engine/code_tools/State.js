export class State { // todo better name
	constructor(scenarios) {
		this.active = null
	}

	update() {
		// if (this.active) {
		// 	this.active.update()
		// }
	}

	draw(draw, guiDraw) {
		for (const scenario of this.scenarios) {
			if (scenario.condition()) {
				scenario.update()
				scenario.draw(draw, guiDraw)
				break
			}
		}

	}

}
