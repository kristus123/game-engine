export class CinematicIntroLevel {
	constructor(level, camera, mouse) {
		this.world = new World(level, camera, mouse)

		this.runAll = new RunAll([
			this.world,
			new Monologue(this.world.deliveryDrone),
		])

		Audio.play()
	}

	update() {

		this.runAll.update()

		if (Distance.withinRadius(this.world.deliveryDrone, this.world.player, 300)) {
			this.world.controller.control(this.world.player)
			this.world.camera.follow(this.world.player)
			this.world.deliveryDrone.resetVelocity()

			this.level.change(new MainLevel(this.level, this.world, this.camera, this.mouse))
		}
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
