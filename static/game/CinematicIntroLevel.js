export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.camera = camera
		this.world = new World(levelSelector, camera, mouse)

		this.deliveryDrone = new GameObject(10_000, 5_000, 10, 10, 1, 10)
		this.world.controller.control(this.deliveryDrone)

		this.runAll = new RunAll([
			this.world,
			this.deliveryDrone,
		])

		// camera.follow(new GameObject(-1000, 0, 1, 1, 1, 20))
		camera.follow(new GameObject(10_000, 5_000, 1, 1, 1, 20))
		// camera.zoom = 0.1

		AudioEngine.play()

		setTimeout(() => {
			setTimeout(() => {
				Push(camera.objectToFollow).towards(new Position(4700, 4700), 10)
				// camera.zoom = 0.7
			}, 1_0)


			setTimeout(() => {
				Push(camera.objectToFollow).towards(new Position(4700, 4700), 20)
				// camera.zoom = 0.7
			}, 1_000)

			setTimeout(() => {
				Push(camera.objectToFollow).towards(new Position(4700, 1000), 20)
				// camera.zoom = 0.7
			}, 3_000)

			setTimeout(() => {
				levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))
			}, 5)

		}, 4_9)

		setTimeout(() => {
			levelSelector.changeActiveLevel(new MainLevel(levelSelector, camera, mouse))
		}, 1);

		this.t = new MultiTextTyper([
			'Current objective:',
			'Deliver package',
			'',
			'',
			'Would be nice to have a greater purpose',
			'',
			'',
			'Maybe one day',
			'',
			'',
			'But not today',
			'',
			'',
			'',
			'',
			'',
			'I eat ass',
		])
	}

	update() {
		this.t.update()
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
		draw.new_text(this.deliveryDrone.position.offset(-50, 60), this.t.text)
	}

}
