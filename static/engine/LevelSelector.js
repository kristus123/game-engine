export class LevelSelector {
	constructor(level) {
		this.activeLevel = level
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
