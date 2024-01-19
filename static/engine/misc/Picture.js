export class Picture {
	constructor(gameObject, src) {
		this.gameObject = gameObject

		this.image = new Image()
		this.image.src = src
	}

	r(draw) {
		const newWidth = this.gameObject.width
		const newHeight = this.gameObject.height

		draw.ctx.save()

		draw.ctx.translate(this.gameObject.position.center.x, this.gameObject.position.center.y)
		const rotationAngle = Math.atan2(this.gameObject.velocity.y, this.gameObject.velocity.x)
		draw.ctx.rotate(rotationAngle)
		draw.ctx.rotate(Math.PI / 2) // 90 degrees

		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)

		draw.ctx.restore()
	}

	draw(draw) {
		if (this.image.complete) {
			const newWidth = this.gameObject.width
			const newHeight = this.gameObject.height

			draw.ctx.save()
			draw.ctx.translate(this.gameObject.x + this.gameObject.width / 2, this.gameObject.y + this.gameObject.height / 2)
			draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
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
		draw.ctx.translate(this.gameObject.x, this.gameObject.y)
		draw.ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		draw.ctx.restore()
	}
}

