export class KillingMachine extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 48 * 5
		this.position.height = 16 * 5

		this.idle = new Sprite(position, '/static/assets/killing_machine_48x16.png', [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		])

		this.killing = new TriggerSprite(position, '/static/assets/killing_machine_48x16.png', [
			{ x: 4, y: 0 },
			{ x: 5, y: 0 },
			{ x: 6, y: 0 },
			{ x: 7, y: 0 },
			{ x: 8, y: 0 },
			{ x: 9, y: 0 },
			{ x: 10, y: 0 },
			{ x: 11, y: 0 },
			{ x: 12, y: 0 },
			{ x: 13, y: 0 },
			{ x: 14, y: 0 },
			{ x: 15, y: 0 },
		])

		const kvernerPosition = this.position.offset(0, 40, 50, 40)
		this.kvernerPosition = kvernerPosition

		this.localObjects = new LocalObjects([
			Init(this, {
				house: new Picture(new Position(0, -800, 20*16, 20*16), '/static/assets/small_house.png'),
			}),

			OnChange(() => G.player.chicken && G.player.touches(kvernerPosition), touches => {
				if (touches) {
					G.player.pickUp.holding = null
					this.killing.play()
					G.player.chicken.removeFromLoop()
				}
			}),

			OnChange(() => this.killing.finished, finished => {
				if (finished) {
					const box = new ChickenBox(this.position.copy().set(350))
					this.localObjects.add(box)
					Camera.follow(box)
				}
			}),

			OnChange(() => G.player.chicken, chicken => {
				if (chicken) {
					Camera.follow(this)
				}
				else {
					Camera.follow(G.player)
				}
			}),

			OnChange(() => G.player.pickUp.holding instanceof ChickenBox, holdingBox => {
				if (holdingBox) {
					Camera.follow(this.house)
				}
			}),

			OnChange(() => G.player.pickUp.holding instanceof ChickenBox && G.player.pickUp.holding.touches(this.house), delivered => {
				if (delivered) {
					console.log('box delivered')
					Html.fadeaway('box delivered', G.player)
					G.player.pickUp.holding = null
					Camera.follow(G.player)
				}
			}),
		])

		const box = new ChickenBox(this.position.copy().set(350))
		this.localObjects.add(box)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		this.idle.draw(draw, guiDraw)

		draw.rectangle(this.kvernerPosition)

		if (G.player.pickUp.holding instanceof Chicken) {
			draw.text(this.position.offset(-50, -150), 'putt kyllingen her')
			draw.text(this.position.offset(-20, -40), '⬇️', 'red')
		}
		else {
		}

		if (this.killing.playing) {
			this.killing.draw(draw, guiDraw)
		}
		else {
			this.idle.draw(draw, guiDraw)
		}
	}
}
