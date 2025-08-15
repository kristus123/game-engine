export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

		this.localObjects = new LocalObjects([
			this.sprite = G.Sprite.p2(this.position, 1),
			new Turret(this.position),


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
		])


		KeyDown('q', () => {
			const jumpPosition = Mouse.position.copy()
			this.jumpPosition = jumpPosition
			this.maxDistance = Distance.between(this, this.jumpPosition)
			this.finished = false
		})
	}

	update() {
		if (this.jumpPosition) {
			const x = Normalize(Distance.between(this, this.jumpPosition), this.maxDistance)

			if (this.touches(this.jumpPosition) && x < 2) {
				this.finished = true
			}

			if (!this.finished) {
				ForcePush(this).towards(this.jumpPosition, 10)
				this.position.scale(x)
			}
			else {
				this.position.scale(1)
			}
		}

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
