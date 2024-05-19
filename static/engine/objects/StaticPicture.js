
export class StaticPicture {
	constructor(position, imagePath) {

		this.image = new Picture(this,imagePath)
	}

	r(draw, rotation=2) {
		const newWidth = this.position.width
		const newHeight = this.position.height

		draw.ctx.save()

		draw.ctx.translate(this.position.center.x, this.position.center.y)

		const rotationAngle = Math.atan2(this.position.velocity.y, this.position.velocity.x)
		draw.ctx.rotate(rotationAngle)
		draw.ctx.rotate(Math.PI / rotation) // 90 degrees

		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)

		draw.ctx.restore()
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

	old_draw(draw, size) {
		const aspectRatio = this.image.width / this.image.height

		let newWidth = size
		let newHeight = size

		if (this.image.width > size) {
			newWidth = size
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > size) {
			newHeight = size
			newWidth = newHeight * aspectRatio
		}

		draw.ctx.save()
		draw.ctx.translate(this.position.x, this.position.y)
		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		draw.ctx.restore()
	}
}

