export class SpinningPicture {
	constructor(position, imagePath, rotationIncrement = 0.01) {
		this.image = new Image()
		this.image.src = imagePath
		this.currentRotation = 0
	}

	draw() {
		const newWidth = this.position.width
		const newHeight = this.position.height

		Draw.ctx.save()

		Draw.ctx.translate(this.position.position.center.x, this.position.position.center.y)
		this.currentRotation += this.rotationIncrement // Increment the rotation
		Draw.ctx.rotate(this.currentRotation) // Apply the current rotation

		Draw.ctx.imageSmoothingEnabled = false
		Draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)

		Draw.ctx.restore()
	}
}

