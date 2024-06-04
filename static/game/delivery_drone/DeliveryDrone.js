export class DeliveryDrone extends DynamicGameObject {
	constructor(position, player, camera, controller) {
		super(position, 10, 5)

		//this.splash = new Splash()

		this.compass = new Compass(camera)
		this.compass.add(player, 'red')

		this.enterVehicle = new EnterVehicle(this, player, camera, controller)

		this.localObjects = new LocalObjects([
			this.enterVehicle,
			this.compass,
		])

		this.picture = new RotatingPicture(this, '/static/assets/cargo_ship.png')
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {

		this.localObjects.draw(draw, guiDraw)
		//this.splash.splash(this.position.center, this.position.center, 100, 'orange', 1, 50)
		//this.splash.draw(draw, guiDraw)

		this.picture.draw(draw, guiDraw)
	}
}
