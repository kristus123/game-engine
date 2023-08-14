class Circle  {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}

	draw(ctx) {
		Draw.circle(ctx, this.x, this.y, this.radius, this.color)
	}

}
