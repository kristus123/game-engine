export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.deliveryDrone = new GameObject(0, 400, 10, 10, 10, 2)
		camera.followInstantly(this.deliveryDrone)
		this.world.controller.control(this.deliveryDrone)

		this.runAll = new RunAll([
			this.world,
			this.deliveryDrone,
		])

		this.runAll.add(new MultiTextTyper(this.deliveryDrone.position.offset(0, 200), [
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
		]))

		AudioEngine.play()
	}

	update() {
		this.runAll.update()

		RunOnce(Distance.withinRadius(this.deliveryDrone, this.world.player, 300), () => {
			this.world.controller.control(this.world.player)
			this.world.camera.follow(this.world.player)
			this.deliveryDrone.resetVelocity()
		})
	}

	draw(draw) {
		this.runAll.draw(draw)
		draw.objectThatIsMovingInRectangularPathAroundObject(this.deliveryDrone, this.world.player.position.center)
	}
}
