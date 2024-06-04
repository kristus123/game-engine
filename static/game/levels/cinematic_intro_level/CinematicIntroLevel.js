export class CinematicIntroLevel {
	constructor(level, camera) {
		this.world = new World(level, camera)

		this.localObjects = new LocalObjects([
			this.world,
			new Monologue(this.world.deliveryDrone),
		])

		Audio.play()
	}

	update() {

		this.localObjects.update()

		if (Distance.withinRadius(this.world.deliveryDrone, this.world.player, 300)) {
			Controller.control(this.world.player)
			this.world.camera.follow(this.world.player)
			this.world.deliveryDrone.resetVelocity()

			this.level.change(new MainLevel(this.level, this.world, this.camera))
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
