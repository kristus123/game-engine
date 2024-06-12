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

export class Sprite {
	constructor(position, imagePath, frameSequence, speed=100) {
		this.image = new Image()
		this.image.src = imagePath

		const d = dimensionsFrom(imagePath)
		this.width = d.width
		this.height = d.height

		this.currentFrame = 0
		const totalFrames = frameSequence.length

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % totalFrames
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
	spinning_draw(draw, guiDraw,angle) {
		if (this.image.complete) {
			const frame = this.frameSequence[this.currentFrame]
			draw.ctx.save()
			draw.ctx.translate(this.position.x+this.position.width*0.5,this.position.y +this.position.height*0.5)
			draw.ctx.imageSmoothingEnabled = false
			
			draw.ctx.rotate(angle)
			draw.ctx.drawImage(
				this.image,
				frame.x * this.width,
				frame.y * this.height,
				this.width,
				this.height,
				this.position.width*-0.5,
				this.position.height *-0.5,
				this.position.width,
				this.position.height 
			)
			draw.ctx.restore()
		}
	}
}
