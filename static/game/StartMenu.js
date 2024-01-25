export class StartMenu {
	constructor(levelSelector, camera, mouse) {
		this.levelSelector = levelSelector
		this.camera = camera
		this.mouse = mouse

		this.startGame = new Button(new Position(0, -400, 400, 200), 'Start game', mouse, () => {
			levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))
		})

		this.settings = new Button(new Position(0, -150, 400, 200), 'Settings', mouse, () => {
			console.log('hei')
		})


		this.runAll = new RunAll([
			new Picture(new GameObject(200, 0, 800, 800, 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			this.startGame,
			this.settings,
		])
	}

	update() {
		this.levelSelector.changeActiveLevel(new CinematicIntroLevel(this.levelSelector, this.camera, this.mouse))
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
