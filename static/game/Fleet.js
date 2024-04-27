export class Fleet extends DynamicGameObject {
	constructor(player) {
		super(200, 0, 300, 300, 1000, 25)

		this.player = player

		this.temporaryChange = new TemporaryChange(this.player, {
			weight: this.weight,
			velocityFactor: 400
		})
	}

	update() {
		this.temporaryChange.applyIf(Collision.between(this, this.player), () => {
			this.velocity.x += Random.integerBetween(-3000, 3000)
			this.velocity.y += Random.integerBetween(-3000, 3000)

			this.player.velocity.x = this.velocity.x
			this.player.velocity.y = this.velocity.y
		})
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		draw.new_text(this.position, 'step your foot on me')
	}
}
