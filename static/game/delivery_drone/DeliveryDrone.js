export class DeliveryDrone extends DynamicGameObject {
	constructor(player, camera, controller, target, x, y) {
		super(x, y, 150, 150, 10, 5)

		// const train = new Train(this, [new DynamicGameObject(this.x+100, 400, 10, 10, 10, 2)])

		this.splash = new Splash()
		this.picture = new Picture(this, '/static/assets/cargo_ship.png')

		this.compass = new Compass(camera)
		this.compass.add(player, 'red')

		this.enterVehicle = new EnterVehicle(this, player, camera, controller)

		this.runAll = new RunAll([
			this.enterVehicle,
			this.compass,
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {

		this.runAll.draw(draw, guiDraw)
		this.splash.splash(this.position.center, this.position.center, 100, 'orange', 1, 50)
		this.splash.draw(draw, guiDraw)

		this.picture.r(draw, 0)
	}
}
