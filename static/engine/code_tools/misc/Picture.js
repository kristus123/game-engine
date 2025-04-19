export class Picture extends StaticGameObject {
	constructor(position, imagePath) {
		super(position)

		this.image = new Image()
		this.image.src = imagePath
	}

	draw(draw, guiDraw) {
		if (this.image.complete) {
			const newWidth = this.position.width
			const newHeight = this.position.height

			draw.ctx.imageSmoothingEnabled = false

			draw.ctx.save()
			draw.ctx.translate(this.position.x + this.position.width, this.position.y + this.position.height)
			draw.ctx.drawImage(this.image, -newWidth, -newHeight, newWidth, newHeight)
			draw.ctx.restore()
		}
	}

	mapToJson() {
		return {
			objectId: this.objectId,
			position: this.position.toJson(),
			imagePath: this.imagePath,
		}
	}

}
