export class CinematicIntroLevel {
	constructor(level, camera, mouse) {
		this.world = new World(level, camera, mouse)

		this.localObjects = new LocalObjects([
			this.world,
			new Monologue(this.world.deliveryDrone),
		])

		Audio.play()
	}

	update() {

		this.localObjects.update()

		if (Distance.withinRadius(this.world.deliveryDrone, this.world.player, 300)) {
			this.world.controller.control(this.world.player)
			this.world.camera.follow(this.world.player)
			this.world.deliveryDrone.resetVelocity()

			this.level.change(new MainLevel(this.level, this.world, this.camera, this.mouse))
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
