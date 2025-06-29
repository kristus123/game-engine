export class KillingMachine extends StaticGameObject {
	constructor(position) {
		super(position)

		this.localObjects = new LocalObjects([
			Init(this, {
				house: new Picture(new Position(0, -800, 20*16, 20*16), '/static/assets/small_house.png'),
			}),
		])

		G.store = this.house

		const box = new ChickenBox(this.position.copy().set(350))
		this.localObjects.add(box)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
