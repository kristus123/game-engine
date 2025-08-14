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

			this.easing = new Easing(Easings.overshootIn),

		])

		KeyDown('q', () => {
			this.targetPosition = Mouse.position.copy().offset(-200, -400)
			this.easing.start()
		})


		KeyDown(' ', () => {
			console.log("hei")
			this.easing.start()
		})

	}

	update() {
		if (this.easing.running) {
			this.position.scale(this.easing.value)
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
