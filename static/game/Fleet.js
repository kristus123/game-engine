export class Fleet extends GameObject {
	constructor(player) {
		super(200, 0, 300, 300, 1000, 25)

		this.player = player

		this.temporaryChange = new TemporaryChange([
			[this.player, 'weight', this.weight],
			[this.player, 'velocityFactor', 400],
		])
	}

	update() {
		this.temporaryChange.applyIf(Collision.between(this, this.player), () => {
			this.velocity.x += Random.integerBetween(-3000, 3000)
			this.velocity.y += Random.integerBetween(-3000, 3000)

			this.player.velocity.x = this.velocity.x
			this.player.velocity.y = this.velocity.y
		})
	}

	draw(ctx) {
		super.draw(ctx)
		Draw.new_text(ctx, this.position, 'step your foot on me')
	}
}
