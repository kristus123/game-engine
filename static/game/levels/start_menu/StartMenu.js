export class StartMenu {
	constructor(level, camera, mouse) {
		this.startGame = new Button(new Position(0, -400, 400, 200), 'Start game', mouse, () => {
			this.level.change(new CinematicIntroLevel(this.level, this.camera, this.mouse))
		})

		this.settings = new Button(new Position(0, -150, 400, 200), 'Settings', mouse, () => {
			console.log('hei')
		})


		this.runAll = new RunAll([
			new Picture(new DynamicGameObject(new Position(200, 0, 800, 800), 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			this.startGame,
			this.settings,
		])
	}

	update() {
		this.level.change(new CinematicIntroLevel(this.level, this.camera, this.mouse))
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
