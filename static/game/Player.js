export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

		const jumpPosition = new Position(1300, 200)
		this.jumpPosition = jumpPosition
		const player = this

		this.localObjects = new LocalObjects([
			this.sprite = G.Sprite.p2(this.position, 1),

			this.motion = new Motion(() => new class {
			constructor() {
			}

			get value() {
				return Distance.between(player, jumpPosition)
			}
			
		}),

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
		draw.circle(this.jumpPosition)
	}
}
