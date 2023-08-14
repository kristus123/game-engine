class Projectile extends GameObject {
	constructor(x, y, radius, color) {
		super(x, y, 10, 10)

		this.radius = radius
		this.color = color

		this.to_x = y
		this.to_y = y
	}

	shoot(to_x, to_y) {
		this.to_x = to_x
		this.to_y = to_y

		const dir = Math.atan2(to_y - this.y, to_x - this.x);

		const speed = 1000
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

		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.to_x, this.to_y);
		ctx.stroke();
	}

}
