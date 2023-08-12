class Text {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.width = 400
		this.height = 100
	}

	draw(ctx) {
		ctx.fillStyle = "brown"
		ctx.fillRect(this.x, this.y, this.width, this.height)

		ctx.strokeStyle = "white"
		ctx.lineWidth = 2;
		ctx.strokeRect(this.x, this.y, this.width, this.height)

		ctx.fillStyle = "white"
		ctx.font = "25px Arial"
		ctx.fillText("hei der! Det er på tide å gå hardt", this.x + 20, this.y + this.height / 2)
	}
}
