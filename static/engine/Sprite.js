// Can be cleaned up later
export class Sprite {
	constructor(spriteSheet) {

		this.spriteSheet = spriteSheet
		// this.spriteSheet.src = 'https://opengameart.org/sites/default/files/exp2.png'
		// this.spriteSheet.src = '/static/assets/Chicken_Sprite_Sheet.png'

		this.frameWidth = 32 // Width of each frame in the sprite sheet
		this.frameHeight = 32 // Height of each frame in the sprite sheet
		this.scale = 5 // Scale factor

		this.frameSequence = [
			{ x: 1, y: 0 }, // Frame 2
			{ x: 2, y: 1 }, // Frame 2
			{ x: 2, y: 2 }, // Frame 2
			{ x: 3, y: 3 }, // Frame 2
			{ x: 3, y: 3 }, // Frame 2
		]

		this.currentFrameIndex = 0 // Index of the current frame in frameSequence
		const totalFrames = this.frameSequence.length
		setInterval(() => {
			this.currentFrameIndex = (this.currentFrameIndex + 1) % totalFrames
		}, 200)

	}


	draw(ctx) {
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
			this.x,
			this.y,
			this.frameWidth * this.scale,
			this.frameHeight * this.scale,
		)

	}

}
