// not in use currently
export class RotatingPicture {
	constructor(position, imagePath) {
		this.image = new Image()
		this.image.src = imagePath
	}

	draw(rotation=20) {
		const newWidth = this.position.width
		const newHeight = this.position.height

		Draw.ctx.save()

		Draw.ctx.translate(this.position.position.center.x, this.position.position.center.y)
		const rotationAngle = Math.atan2(this.position.velocity.y, this.position.velocity.x)
		Draw.ctx.rotate(rotationAngle)
		Draw.ctx.rotate(Math.PI / rotation) // 90 degrees

		Draw.ctx.imageSmoothingEnabled = false
		Draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)

		Draw.ctx.restore()
	}
}
