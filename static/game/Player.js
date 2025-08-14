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
				console.log(v)
				this.position.resize(v)
			})

		])


	}

	update() {
		this.localObjects.update()

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
