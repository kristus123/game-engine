export class Boat extends DynamicGameObject {
	constructor(position, player) {
		super(position, 2000, 10)

		this.position.width = 100
		this.position.height = 100

		this.localObjects = new LocalObjects([
			new EnterVehicle(this, player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.color(this.position, 'brown')

	}
}
