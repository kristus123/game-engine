export class Sprite {
	constructor(gameObject, src, frameWidth, frameHeight, scale, frameSequence) {
		this.gameObject = gameObject

		this.spriteSheet = new Image()
		this.spriteSheet.src = src

		this.frameWidth = frameWidth // Width of each frame in the sprite sheet
		this.frameHeight = frameHeight // Height of each frame in the sprite sheet
		this.scale = scale // Scale factor

		this.frameSequence = frameSequence

		this.currentFrameIndex = 0 // Index of the current frame in frameSequence
		const totalFrames = this.frameSequence.length
		setInterval(() => {
			this.currentFrameIndex = (this.currentFrameIndex + 1) % totalFrames
		}, 100)
	}

	draw(draw) {
		if (this.spriteSheet.complete) {

			const frameInfo = this.frameSequence[this.currentFrameIndex]
			const currentFrameX = frameInfo.x
			const currentFrameY = frameInfo.y

			draw.ctx.imageSmoothingEnabled = false
			draw.ctx.drawImage(
				this.spriteSheet,
				currentFrameX * this.frameWidth,
				currentFrameY * this.frameHeight,
				this.frameWidth,
				this.frameHeight,
				this.gameObject.x,
				this.gameObject.y,
				this.frameWidth * this.scale,
				this.frameHeight * this.scale,
			)
		}
	}

}
