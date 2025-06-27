export class Sprite {
	constructor(position, image, asepriteJson, currentAnimation = "") {
		this.currentFrame = 0

		if (this.asepriteJson.tagPresent("idle")) {
			this.activeFrames = this.asepriteJson.tags["idle"]
		}
		else if (this.asepriteJson.tagPresent("")) {
			this.activeFrames = this.asepriteJson.tags[""]
		}

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % this.activeFrames.length
		}, 100)
	}

	reset() {
		this.currentFrame = 0
	}

	draw(draw, guiDraw) {
		const frame = this.activeFrames[this.currentFrame]

		draw.ctx.imageSmoothingEnabled = false
		draw.ctx.drawImage(
			this.image,
			frame.x, frame.y,
			frame.width, frame.height,
			this.position.x, this.position.y,
			this.position.width, this.position.height
		)
	}
}
