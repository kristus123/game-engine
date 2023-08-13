class Projectile extends GameObject {
	constructor(x, y, radius, color) {
		super(x, y, 10, 10)

		this.x = x
		this.y = y

		this.radius = radius
		this.color = color
		this.velocity = {
			x: 0,
			y: 0,
		}
	}

	shoot(to_x, to_y) {
		const dir = Math.atan2(to_y - this.y, to_x - this.x);

		const speed = 7
		const dx = Math.cos(dir) * speed;
		const dy = Math.sin(dir) * speed;

		this.velocity = {
			x: dx,
			y: dy,
		}
	}

	draw(ctx) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = this.color
		ctx.fill()
	}

	update() {
		this.x += this.velocity.x
		this.y += this.velocity.y
	}

}
