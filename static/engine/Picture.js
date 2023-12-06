export class Picture {
	constructor(gameObject, src) {
		this.gameObject = gameObject;

		this.image = new Image();
		this.image.src = src;
	}

	r(ctx) {
		const aspectRatio = this.image.width / this.image.height

		const maxWidth = 500
		const maxHeight = 200

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

		ctx.translate(this.gameObject.x, this.gameObject.y)
		const rotationAngle = Math.atan2(this.gameObject.velocity.y, this.gameObject.velocity.x)
		ctx.rotate(rotationAngle)
		ctx.rotate(Math.PI / 2) // 90 degrees

		ctx.drawImage(
			this.image,
			-newWidth / 2,
			-newHeight / 2,
			newWidth,
			newHeight,
		)

		ctx.restore()
	}

	draw(ctx) {
		const newWidth = this.gameObject.width
		const newHeight = this.gameObject.height

		ctx.save();
		ctx.translate(this.gameObject.x + this.gameObject.width / 2, this.gameObject.y + this.gameObject.height / 2);
		ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight);
		ctx.restore();
	}


	old_draw(ctx, size) {
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

		ctx.save()
		ctx.translate(this.gameObject.x, this.gameObject.y)
		ctx.drawImage(this.image, -newWidth / 2, -newHeight / 2, newWidth, newHeight)
		ctx.restore()
	}




}

