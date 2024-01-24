export class StartMenu {
	constructor(levelSelector, camera, mouse) {
		// this.world = new World(levelSelector, camera, mouse)

		this.button = new Button(new Position(0, 0, 200, 200), mouse)
		// levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))
	}

	update() {
	}

	draw(draw) {
		this.button.draw(draw)
	}
}
