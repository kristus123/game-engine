export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.Sprite.player(this.position, 1),
			}),
			new Throw(() => new ChickenFood(this.position.copy())),

			G.splash,

			OnChange(() => this.holding, h => {
				if (h) {
					this.sprite.happy.loop()
				}
				else {
					this.sprite.idle.loop()
				}
			}),

			OnTrue(() => Keyboard.up, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}

				this.sprite.up.loop()
			}),

			OnTrue(() => Keyboard.down, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.down.loop()
			}),

			OnTrue(() => Keyboard.left, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.left.loop()
			}),

			OnTrue(() => Keyboard.right, () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.right.loop()
			}),

			OnTrue(() => Keyboard.noButtonsPressed(), () => {
				if (this.sprite.activeTag == 'poop') {
					return
				}
				this.sprite.idle.loop()
			}),
		])

		KeyDown('e', () => {
			if (this.holding) {
				this.holding = null
			}
			else {
				const p = this.touchesAny(G.poops)
				if (p) {
					this.holding = p
					console.log('hei')
				}
			}
		})

		KeyDown('p', () => {
			Controller.disabled = true
			this.velocity.reset()
			this.sprite.poop.play(() => {
				Controller.disabled = false

				const poop = new Square(this.position.copy(40, 80), 20)
				poop.color = 'brown'

				G.poops.add(poop)
				G.splash.random(poop, 'brown')
				Html.fadeaway('poop', this.position.copy().up(200).left(400))
			})
		})

	}

	update() {
		this.localObjects.update()

		if (this.holding) {
			this.holding.position.xy(this.position.offset(50))
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.holding) {
			draw.text(this.holding.position.offset(100), '"E" to drop')
		}
		else {
			const p = this.touchesAny(G.poops)
			if (p) {
				draw.text(p.position.offset(0), '"E" to pick up')
			}

		}
	}
}
