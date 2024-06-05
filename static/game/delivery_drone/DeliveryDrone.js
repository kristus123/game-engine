export class DeliveryDrone extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 5)

		//this.splash = new Splash()

		this.compass = new Compass()
		this.compass.add(player, 'red')

		this.enterVehicle = new EnterVehicle(this, player)

		this.localObjects = new LocalObjects([
			this.enterVehicle,
			this.compass,
		])

		this.picture = new Picture(this, '/static/assets/image/cargo_ship.png')
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		//this.picture.draw(draw, guiDraw)

		super.draw(draw, guiDraw)
	}
}
