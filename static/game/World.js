export class World {
	constructor(levelSelector, camera, mouse) {
		this.levelSelector = levelSelector
		this.camera = camera
		this.mouse = mouse
		this.controller = new Controller()

		this.player = new Player(mouse)
		this.camera.follow(this.player)
		this.controller.control(this.player)

		this.runAll = new RunAll([
			new StarBackground(),
			// new Planets(),
			this.controller,
			new Picture(new GameObject(500, 0, 1500, 1500, 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			this.player,
			{
				draw: draw => draw.gradient(new Position(1250, 750))
			},
			new Picture(new GameObject(-3491, 2101, 800, 800, 1, 1), '/static/assets/planets/moon27x26.png'),
			new Picture(new GameObject(2100, 5000, 3000, 3000, 1, 1), '/static/assets/planets/sun.png'),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
