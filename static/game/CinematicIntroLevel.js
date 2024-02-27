export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(camera, mouse)

		this.deliveryDrone = new DeliveryDrone(camera, this.world.player, -15000, 400)
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

		if (Distance.withinRadius( this.world.player, this.deliveryDrone, 100)) {
			draw.new_text(this.deliveryDrone.position, 'E to enter')
		}
	}
}
