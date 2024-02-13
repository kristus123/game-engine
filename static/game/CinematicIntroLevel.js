export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.deliveryDrone = new GameObject(-120, 400, 10, 10, 10, 2)
		this.world.controller.control(this.deliveryDrone)

		this.runAll = new RunAll([
			this.world,
			this.deliveryDrone,
		])

		// camera.follow(new GameObject(-1000, 0, 1, 1, 1, 20))
		camera.followInstantly(this.deliveryDrone)
		// camera.zoom = 0.1

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
		])


		this.playerTalking = new MultiTextTyper([
			'wow. what is that?',
			'Wait... are we talking at the same time',
			'',
			'',
			'is this a bug or a feature?',
		])
	}

	update() {
		this.t.update()
		this.runAll.update()

		if (Distance.withinRadius(this.deliveryDrone, this.world.player, 300)) {
			this.world.controller.control(this.world.player)
			this.playerTalking.update()
			this.world.camera.follow(this.world.player)

			// this.deliveryDrone.position = this.world.player.position
		}
	}

	draw(draw) {
		this.runAll.draw(draw)
		draw.new_text(this.deliveryDrone.position.offset(50, 80), this.t.text)


		draw.new_text(this.world.player.position.offset(-50, -50), this.playerTalking.text)

		draw.objectThatIsMovingInRectangularPathAroundObject(this.deliveryDrone, this.world.player)

	}

}
