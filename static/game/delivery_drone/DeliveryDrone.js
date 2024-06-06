export class DeliveryDrone extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 5)

		this.position.width = 100
		this.position.height = 100

		this.compass = new Compass()
		this.compass.add(player, 'red')

		this.localObjects = new LocalObjects([
			new EnterVehicle(this, player),
			this.compass,
			new RotatingPicture(this, '/static/assets/image/cargo_ship.png'),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
