export class Picture {
	constructor(src) {
		this.image = new Image()
		this.image.src = src
	}

	draw(ctx, position, size) {
		const aspectRatio = this.image.width / this.image.height

		const maxWidth = size
		const maxHeight = size

		let newWidth = maxWidth
		let newHeight = maxHeight

		if (this.image.width > maxWidth) {
			newWidth = maxWidth
			newHeight = newWidth / aspectRatio
		}

		if (newHeight > maxHeight) {
			newHeight = maxHeight
			newWidth = newHeight * aspectRatio
		}

		ctx.save()
		ctx.translate(position.x, position.y)
		ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		ctx.restore()
	}
}
