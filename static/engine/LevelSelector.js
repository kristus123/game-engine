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

	draw(draw) {
		this.activeLevel.draw(draw)
	}

}
