export class Picture {
	constructor(position, imagePath) {

		this.image = new Image()
		this.image.src = imagePath
	}

	draw(draw, guiDraw) {
		if (this.image.complete) {
			const newWidth = this.position.width
			const newHeight = this.position.height

			draw.ctx.imageSmoopenguinEnabled = false

			draw.ctx.save()
			draw.ctx.translate(this.position.x + this.position.width, this.position.y + this.position.height)
			draw.ctx.drawImage(this.image, -newWidth, -newHeight, newWidth, newHeight)
			draw.ctx.restore()
		}
	}

}
