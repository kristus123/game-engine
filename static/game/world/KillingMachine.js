export class KillingMachine extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 48 * 5
		this.position.height = 16 * 5


		this.kvernerPosition = this.position.offset(0, 40, 50, 40)

		this.localObjects = new LocalObjects([
			G.sprites.blob(this.position),
			G.sprites.blob(this.position),
			G.sprites.killingMachine(this.position),
			Init(this, {
				// sprites: new KillingMachineSprites(this.position),
				house: new Picture(new Position(0, -800, 20*16, 20*16), '/static/assets/small_house.png'),
			}),

			OnChange(() => G.player.pickUpDeadChicken.holding && G.player.touches(this.kvernerPosition), touches => {
				if (touches) {
					G.player.pickUpDeadChicken.holding.removeFromLoop()
					G.player.pickUpDeadChicken.drop()

					// this.sprites.kill.play()
				}
			}),

			// OnChange(() => this.sprites.kill.finished, finished => {
			// 	if (finished) {
			// 		const box = new ChickenBox(this.position.copy().set(350))
			// 		this.localObjects.add(box)
			// 	}
			// }),
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

		draw.red(this.kvernerPosition)

		if (G.player.pickUpChicken.holding) {
			draw.text(this.position.offset(-50, -150), 'putt kyllingen her')
			draw.text(this.position.offset(-20, -40), '⬇️', 'red')
		}
	}
}
