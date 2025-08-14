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

			this.motion = new Motion(),
		])

		KeyDown('q', () => {
			this.targetPosition = Mouse.position.copy().offset(-200, -400)
			this.motion.start()
		})

		this.motion.start()
	}

	update() {
		this.position.scale(this.motion.value)
		this.localObjects.update()


		if (this.targetPosition) {
			ForcePush(this).towards(this.targetPosition, 7)

			if (this.within(100, this.targetPosition)) {
				this.targetPosition = null
			}
		}

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
