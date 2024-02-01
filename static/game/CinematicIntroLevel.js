export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.camera = camera
		this.world = new World(levelSelector, camera, mouse)
		// camera.follow(new GameObject(-1000, 0, 1, 1, 1, 20))
		camera.follow(new GameObject(10_000, 5_000, 1, 1, 1, 20))
		camera.position = new Position(10_000, 5_000)
		// camera.zoom = 0.1

		this.deliveryDrone = new GameObject(10_000, 5_000, 10, 10, 1, 10)
		this.world.controller.control(this.deliveryDrone)

		this.runAll = new RunAll([
			new RecordMovement(this.camera.objectToFollow, mouse),
			this.world,
			this.deliveryDrone,
		])
			// new RecordMovement(this.camera.objectToFollow, this.mouse),


		AudioEngine.play()


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
