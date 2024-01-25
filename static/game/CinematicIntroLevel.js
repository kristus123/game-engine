export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.camera = camera
		this.world = new World(levelSelector, camera, mouse)

		this.runAll = new RunAll([
			this.world,
			new Picture(new GameObject(500, 0, 1500, 1500, 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			new Picture(new GameObject(1500, 3000, 800, 800, 1, 1), '/static/assets/planets/moon27x26.png'),
			new Picture(new GameObject(2100, 5000, 3000, 3000, 1, 1), '/static/assets/planets/sun.png'),
		])


		camera.follow(new GameObject(-1800, 0, 1, 1, 1, 20))

		AudioEngine.play()

		setTimeout(() => {
			Push(camera.objectToFollow).towards(new Position(500, 100), 10)
			camera.zoom = 0.5
		}, 1_000)

		setTimeout(() => {
			Push(camera.objectToFollow).towards(new Position(3000, 8000), 10)
			camera.zoom = 0.5
		}, 10_000)

		setTimeout(() => {
			Push(camera.objectToFollow).towards(new Position(10_000, 8000), 50)
		}, 21_000)

		setTimeout(() => {
			Push(camera.objectToFollow).towards(new Position(10_000, 8000), 100)
		}, 28_000)

		setTimeout(() => {
			levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))
		}, 30_000)

	}


	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}

}
