export class Sprite {
	constructor(dynamicGameObject, src, frameWidth, frameHeight, scale, frameSequence, speed=100) {
		this.spriteSheet = new Image()
		this.spriteSheet.src = src

		this.currentFrameIndex = 0 // Index of the current frame in frameSequence
		const totalFrames = frameSequence.length

		setInterval(() => {
			this.currentFrameIndex = (this.currentFrameIndex + 1) % totalFrames
		}, speed)
	}

	draw(draw, guiDraw) {
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
				this.dynamicGameObject.x,
				this.dynamicGameObject.y,
				this.frameWidth * this.scale,
				this.frameHeight * this.scale,
			)
		}
	}

}
