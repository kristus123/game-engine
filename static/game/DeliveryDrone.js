export class DeliveryDrone extends GameObject {
	constructor(player, camera, controller, target, x, y) {
		super(x, y, 150, 150, 10, 2)

		// const train = new Train(this, [new GameObject(this.x+100, 400, 10, 10, 10, 2)])

		this.splash = new Splash()
		this.picture = new Picture(this, '/static/assets/cargo_ship.png')


		this.compass = new Compass(camera, target),
		this.enterVehicle = new EnterVehicle(this, player, camera, controller)

		this.runAll = new RunAll([
			this.enterVehicle
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		if (this.enterVehicle.entered) {
			this.compass.draw(draw)
		}

		this.runAll.draw(draw)
		this.splash.splash(this.position.center, this.position.center, 200, 'orange', 1, 300)
		this.splash.draw(draw)

		this.picture.r(draw, 0)

	}

}
