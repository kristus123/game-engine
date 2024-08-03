function dimensionsFrom(imagePath) {
	const pattern = /(\d+)x(\d+)/
	const match = imagePath.match(pattern)

	if (match) {
		return {
			width: parseInt(match[1], 10),
			height: parseInt(match[2], 10)
		}
	}
	else {
		throw new Error('xx')
	}
}

export class Sprite {
	constructor(position, imagePath, frameSequence, speed=100) {
		this.image = new Image()
		this.image.src = imagePath

		const d = dimensionsFrom(imagePath)
		this.width = d.width
		this.height = d.height

		this.currentFrame = 0

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % this.frameSequence.length
		}, speed)
	}

	draw(draw, guiDraw) {
		if (this.image.complete) {

			const frame = this.frameSequence[this.currentFrame]

			draw.ctx.imageSmoothingEnabled = false
			draw.ctx.drawImage(
				this.image,
				frame.x * this.width,
				frame.y * this.height,
				this.width,
				this.height,
				this.position.x,
				this.position.y,
				this.position.width,
				this.position.height,
			)
		}
	}
}
