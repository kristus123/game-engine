export class StartMenu {
	constructor(level) {
		this.startGame = new Button(new Position(0, -400, 400, 200), 'Start game', () => {
			this.level.change(new CinematicIntroLevel(this.level))
		})

		this.settings = new Button(new Position(0, -150, 400, 200), 'Settings', () => {
			console.log('hei')
		})


		this.localObjects = new LocalObjects([
			new Picture(new DynamicGameObject(new Position(200, 0, 800, 800), 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			this.startGame,
			this.settings,
		])
	}

	update() {
		this.level.change(new CinematicIntroLevel(this.level))
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
