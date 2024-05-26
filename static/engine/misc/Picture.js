export class Picture {
	constructor(o, imagePath) {
		this.dynamicGameObject = o

		this.image = new Image()
		this.image.src = imagePath
	}

	draw(draw, guiDraw) { // todo
		if (this.image.complete) {
			const newWidth = this.dynamicGameObject.width
			const newHeight = this.dynamicGameObject.height

			draw.ctx.imageSmoothingEnabled = false

			draw.ctx.save()
			draw.ctx.translate(this.dynamicGameObject.x + this.dynamicGameObject.width, this.dynamicGameObject.y + this.dynamicGameObject.height)
			draw.ctx.drawImage(this.image, -newWidth, -newHeight, newWidth, newHeight)
			draw.ctx.restore()
		}
	}

}

