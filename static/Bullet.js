class Bullet {
	constructor() {
		this.bullets = []
		this.timeUntilNextShot = 0
	}

	shoot(x, y) {
		if (this.timeUntilNextShot == 0) {
			this.bullets.push({
				x:x,
				y:y,
				height: 10,
				width: 10,
			})

			this.timeUntilNextShot = 2
		} else {
			this.timeUntilNextShot -= 1
		}
	}

	draw(ctx) {
		this.bullets.forEach(b => {
			b.y += 20

			ctx.fillStyle = "red"
			ctx.fillRect(b.x, b.y, b.height, b.width)
		})
	}

	ifHitReduceHp(enemy) {
		this.bullets.forEach(b => {
			if (Colission.between(b, enemy)) {
				b.y = -2000
				enemy.health -= 1
			}

			if (enemy.health == 0)
				enemy.y = -2000
		})
	}
}
