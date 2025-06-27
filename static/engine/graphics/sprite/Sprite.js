export class Sprite {
	constructor(position, image, asepriteJson, frameSequence={}) {
		this.currentFrame = 0

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % this.frameSequence.length
		}, 100)
	}

	reset() {
		this.currentFrame = 0
	}

	draw(draw, guiDraw) {
		if (typeof this.image === 'string') {
		}
		else {

			const frame = this.frameSequence[this.currentFrame]

			draw.ctx.imageSmoothingEnabled = false
			draw.ctx.drawImage(
				this.image,
				frame.x * this.asepriteJson.width,
				frame.y * this.asepriteJson.height,
				this.asepriteJson.width,
				this.asepriteJson.height,
				this.position.x,
				this.position.y,
				this.position.width,
				this.position.height,
			)
		}
	}

	mirrorDraw(draw, guiDraw, mirrorX = true, mirrorY = false) {
		if (typeof this.image === 'string') {
		}
		else {
			const frame = this.frameSequence[this.currentFrame]
			const { x, y, width, height } = this.position
			const ctx = draw.ctx

			ctx.save()
			ctx.imageSmoothingEnabled = false

			// Set up the origin correctly for mirroring
			ctx.translate(
				mirrorX ? x + width : x,
				mirrorY ? y + height : y
			)

			ctx.scale(
				mirrorX ? -1 : 1,
				mirrorY ? -1 : 1
			)

			ctx.drawImage(
				this.image,
				frame.x * this.asepriteJson.width,
				frame.y * this.asepriteJson.height,
				this.asepriteJson.width,
				this.asepriteJson.height,
				0, 0, width, height
			)

			ctx.restore()
		}
	}




}
