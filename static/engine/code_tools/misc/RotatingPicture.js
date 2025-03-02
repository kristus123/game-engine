export class RotatingPicture {
	constructor(position, imagePath) {
		this.image = new Image()
		this.image.src = imagePath
	}

	draw(draw, rotation=20) {
		const newWidth = this.position.width
		const newHeight = this.position.height

		draw.ctx.save()

		draw.ctx.translate(this.position.position.center.x, this.position.position.center.y)
		const rotationAngle = Math.atan2(this.position.velocity.y, this.position.velocity.x)
		draw.ctx.rotate(rotationAngle)
		draw.ctx.rotate(Math.PI / rotation) // 90 degrees

		draw.ctx.imageSmoothingEnabled = false
		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)

		draw.ctx.restore()
	}
}
