export class Gun {
	constructor(player) {
		this.player = player

		this.bullets = []
		this.physics = new Physics()
	}

	updatePhysics(deltaTime) {
		this.physics.update(deltaTime)
	}

	shoot(to) {
		const b = new Bullet(this.player, to)

		this.bullets.push(b)
		this.physics.applyPhysics(b)

		return b
	}

	draw(ctx) {
		this.bullets.forEach(b => {
			b.draw(ctx)
		})
	}
	
}
