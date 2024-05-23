export class StaticPicture {
	constructor(position, imagePath) {

		this.image = new Image()
		this.image.src = imagePath
	}

	draw(draw, guiDraw) { // todo
		if (this.image.complete) {
			const newWidth = this.image.width
			const newHeight = this.image.height

			draw.ctx.imageSmoothingEnabled = false

			draw.ctx.save()
			draw.ctx.translate(this.position.x + this.position.width, this.position.y + this.position.height)

			draw.ctx.drawImage(this.image, -newWidth, -newHeight, newWidth, newHeight)

			draw.ctx.restore()
		}
	}
}

