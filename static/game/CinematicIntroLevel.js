export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.camera = camera
		this.world = new World(levelSelector, camera, mouse)

		this.deliveryDrone = new GameObject(-1800, 0, 20, 20, 10, 40)
		this.world.controller.control(this.deliveryDrone)

		this.runAll = new RunAll([
			this.deliveryDrone,
			this.world,
			new Picture(new GameObject(500, 0, 1500, 1500, 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			new Picture(new GameObject(1500, 3000, 800, 800, 1, 1), '/static/assets/planets/moon27x26.png'),
			new Picture(new GameObject(2100, 5000, 3000, 3000, 1, 1), '/static/assets/planets/sun.png'),
		])

		camera.follow(new GameObject(-1800, 0, 1, 1, 1, 20))

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

		this.t = new TextTyperWithBackspaceEffect("Current objective:")
		this.t.onFinish = () => {
			setTimeout(() => {
				this.t = new TextTyperWithBackspaceEffect("Deliver package")
			}, 500);
		}
	}

	update() {
		this.t.update()
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		guiDraw.new_text(GuiPosition.middle(), this.t.text, 50)

		this.runAll.draw(draw)
		draw.gradient(new Position(1300, 800))
	}

}
