export class Level {
	constructor() {
		this.activeLevel = null
	}

	change(level) {
		this.activeLevel = level
	}

	update() {
		this.activeLevel.update()
	}

	draw(draw, guiDraw) {
		this.activeLevel.draw(draw, guiDraw)
	}

}
