export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.runAll = new RunAll([
			this.world,
		])

		this.runAll.add(new MultiTextTyper(this.world.deliveryDrone.position.offset(0, 200), [
			'use wasd or arrows to drive',
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

		if (Distance.withinRadius(this.world.deliveryDrone, this.world.player, 300)) {
			this.world.controller.control(this.world.player)
			this.world.camera.follow(this.world.player)
			this.world.deliveryDrone.resetVelocity()

			this.levelSelector.changeActiveLevel(new MainLevel(this.levelSelector, this.world, this.camera, this.mouse))
		}
	}

	draw(draw) {
		this.runAll.draw(draw)
	}
}
