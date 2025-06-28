export class KillingMachine extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 48 * 5
		this.position.height = 16 * 5


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


		if (G.player.pickUpChicken.holding) {
			draw.text(this.position.offset(-50, -150), 'putt kyllingen her')
			draw.text(this.position.offset(-20, -40), '⬇️', 'red')
		}
	}
}
