function dimensionsFrom(src) {
	const pattern = /(\d+)x(\d+)/
	const match = src.match(pattern)

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

export class TriggerSprite {
	constructor(position, imagePath, frameSequence, speed=100) {
		this.image = new Image()
		this.image.src = imagePath

		const d = dimensionsFrom(imagePath)
		this.width = d.width
		this.height = d.height

		this.currentFrame = 0
		const totalFrames = frameSequence.length

		this.pause = true
		setInterval(() => {
			if (this.pause) {
				// do nothing
			}
			else if (this.currentFrame+1 != totalFrames) {
				this.currentFrame ++
			}
			else if (this.currentFrame+1 == totalFrames) {
				this.pause = true
				this.currentFrame = 0
			}
		}, speed)
	}

	play(position = this.position) {
		this.position = position
		this.pause = false
		this.currentFrame = 0
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
