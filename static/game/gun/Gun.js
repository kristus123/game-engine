export class Gun {
	constructor(player) {
		this.player = player

		this.bullets = []
	}

	shoot(position) {
		const b = new Bullet(this.player, position)

		this.bullets.push(b)

		return b
	}

	draw(ctx) {
		this.bullets.forEach(b => {
			b.draw(ctx)
		})
	}

}
