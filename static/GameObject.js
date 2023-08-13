class GameObject {
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height

		this.gravity = {
			x: 0,
			y: 0,
		}

		this.velocity = {
			x: 0,
			y: 0,
		}

	}

	update() {
	}

	draw(ctx) {
		ctx.fillStyle = "orange"
		ctx.fillRect(this.x, this.y, this.width, this.height)

		ctx.strokeStyle = "white"
		ctx.lineWidth = 4;
		ctx.strokeRect(this.x, this.y, this.width, this.height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"

		if (this.debug) {
			ctx.fillText("x:" + this.x, this.x+this.width /2 + 100, this.y+this.height/2)
			ctx.fillText("y:" + this.y, this.x-100, this.y+this.height/2)
			ctx.fillText("velocity x:" + this.velocity.x, this.x, this.y - 20)
			ctx.fillText("velocity y:" + this.velocity.y, this.x, this.y + 20)
		}
	}
}
