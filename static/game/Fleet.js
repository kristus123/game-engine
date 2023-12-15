export class Fleet extends GameObject {
    constructor(player) {
        super(200, 0, 300, 300, 1000, 25);

        this.player = player;

		this.originalPlayerValues = {
			weight: player.weight,
			velocityFactor: player.velocityFactor,
		}
    }

    update() {

		if (Collision.between(this, this.player)) {
			const speedX = Random.integerBetween(-3000, 3000)
			const speedY = Random.integerBetween(-3000, 3000)

			this.player.weight = this.weight
			this.player.velocityFactor = 700

			this.player.velocity.x = this.velocity.x + speedX
			this.player.velocity.y = this.velocity.y + speedY

			this.velocity.x += speedX
			this.velocity.y += speedY
		}
		else {
			this.player.weight = this.originalPlayerValues.weight
			this.player.velocityFactor = this.originalPlayerValues.velocityFactor
		}
    }

	draw(ctx) {
		super.draw(ctx)
		Draw.new_text(ctx, this.position, 'step your foot on me')
		
	}
}
