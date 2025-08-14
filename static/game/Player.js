export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

		this.localObjects = new LocalObjects([
			this.sprite = G.Sprite.p2(this.position, 1),

			OnChange(() => this.movingUp, up => {
				if (up) {
					this.sprite.up.loop()
				}
				else {
					this.sprite.idle.loop()
				}
			}),

			OnChange(() => this.direction, d => {
				this.sprite.tags[d].loop()
			}),

			new PingPong(v => {
				this.position.resize(v)
			})
		])


		KeyDown('q', () => {
			this.targetPosition = Mouse.position.copy().offset(-100, -100)
		})
	}

	update() {
		this.localObjects.update()


		if (this.targetPosition) {
			ForcePush(this).towards(this.targetPosition, 14)

			if (this.within(100, this.targetPosition)) {
				this.targetPosition = null
			}
		}

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
