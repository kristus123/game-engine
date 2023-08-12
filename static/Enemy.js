class Enemy {
	constructor() {
		this.x = 200
		this.y = 10
		this.health = 50
		this.width = 40
		this.height = 40
	}

	draw(ctx) {
		ctx.fillStyle = "orange"
		ctx.fillRect(this.x, this.y, this.width, this.height)

		ctx.strokeStyle = "white"
		ctx.lineWidth = 4;
		ctx.strokeRect(this.x, this.y, this.width, this.height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"
		ctx.fillText(this.health, this.x+this.width /2, this.y+this.height/2)
	}
}
