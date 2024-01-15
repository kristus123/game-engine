// Can be cleaned up later
// Currently only made for chicken
export class Sprite {
	constructor(gameObject, src, frameWidth, frameHeight, scale, frameSequence) {

		this.gameObject = gameObject
		this.spriteSheet = new Image()
		// this.spriteSheet.src = 'https://opengameart.org/sites/default/files/exp2.png'
		this.spriteSheet.src = src

		this.frameWidth = frameWidth // Width of each frame in the sprite sheet
		this.frameHeight = frameHeight // Height of each frame in the sprite sheet
		this.scale = scale // Scale factor

		this.frameSequence = frameSequence

		this.currentFrameIndex = 0 // Index of the current frame in frameSequence
		const totalFrames = this.frameSequence.length
		setInterval(() => {
			this.currentFrameIndex = (this.currentFrameIndex + 1) % totalFrames
		}, 200)
	}

	draw(ctx) {
		if (this.spriteSheet.complete) {

			const frameInfo = this.frameSequence[this.currentFrameIndex]
			const currentFrameX = frameInfo.x
			const currentFrameY = frameInfo.y

			ctx.imageSmoothingEnabled = false
			ctx.drawImage(
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
