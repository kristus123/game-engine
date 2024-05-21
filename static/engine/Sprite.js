function dimensionsFrom(src) {
    const pattern = /(\d+)x(\d+)/;
    const match = src.match(pattern);

    if (match) {
        return {
            width: parseInt(match[1], 10),
            height: parseInt(match[2], 10)
        };
    } else {
		throw new Error("xx")
    }
}

export class Sprite {
	constructor(position, src, scale, frameSequence, speed=100) {
		this.spriteSheet = new Image()
		this.spriteSheet.src = src

		const d = dimensionsFrom(src)
		this.width = d.width
		this.height = d.height

		this.currentFrame = 0
		const totalFrames = frameSequence.length

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % totalFrames
		}, speed)
	}

	draw(draw, guiDraw) {
		if (this.spriteSheet.complete) {

			const frame = this.frameSequence[this.currentFrame]

			draw.ctx.imageSmoothingEnabled = false
			draw.ctx.drawImage(
				this.spriteSheet,
				frame.x * this.width,
				frame.y * this.height,
				this.width,
				this.height,
				this.position.x,
				this.position.y,
				this.width * this.scale,
				this.height * this.scale,
			)
		}
	}

}
