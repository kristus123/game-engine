export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.camera = camera
		this.world = new World(levelSelector, camera, mouse)

		this.deliveryDrone = new GameObject(-500, 0, 10, 10, 1, 10)
		this.world.controller.control(this.deliveryDrone)

		this.runAll = new RunAll([
			this.world,
			new Picture(new GameObject(500, 0, 1500, 1500, 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			this.deliveryDrone,
			{
				draw: draw => draw.gradient(new Position(1250, 750))
			},
			new Picture(new GameObject(1500, 3000, 800, 800, 1, 1), '/static/assets/planets/moon27x26.png'),
			new Picture(new GameObject(2100, 5000, 3000, 3000, 1, 1), '/static/assets/planets/sun.png'),
		])

		// camera.follow(new GameObject(-1000, 0, 1, 1, 1, 20))
		camera.follow(new GameObject(0, 0, 1, 1, 1, 20))
			camera.zoom = 0.7

		AudioEngine.play()

		setTimeout(() => {
			setTimeout(() => {
				Push(camera.objectToFollow).towards(new Position(500, 100), 10)
				camera.zoom = 0.7
			}, 1_000)

			setTimeout(() => {
				Push(camera.objectToFollow).towards(new Position(3000, 8000), 10)
				camera.zoom = 0.4
			}, 10_000)

			setTimeout(() => {
				Push(camera.objectToFollow).towards(new Position(10_000, 8000), 50)
			}, 21_000)

			setTimeout(() => {
				Push(camera.objectToFollow).towards(new Position(10_000, 8000), 100)
			}, 28_000)

			setTimeout(() => {
				levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))
			}, 40_000)
			
		}, 4_900);

		this.t = new MultiTextTyper([
			"Current objective:", 
			"Deliver package", 
			"",
			"",
			"Would be nice to have a greater purpose",
			"",
			"",
			"Maybe one day",
			"",
			"",
			"But not today",
		])

	}

	update() {
		this.t.update()
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw)
		draw.new_text(this.deliveryDrone.position.offset(-50, 60), this.t.text)
	}

}
