export class CinematicIntroLevel {
	constructor(levelSelector, camera, mouse) {
		this.world = new World(levelSelector, camera, mouse)

		this.runAll = new RunAll([
			this.world,
			new Monologue(this.world.deliveryDrone),
		])

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

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
