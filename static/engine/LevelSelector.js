export class LevelSelector {
	constructor() {
		this.activeLevel = null
	}

	changeActiveLevel(level) {
		this.activeLevel = level
	}

	update() {
		this.activeLevel.update()
	}

	draw(draw, guiDraw) {
		this.activeLevel.draw(draw, guiDraw)
	}

}
