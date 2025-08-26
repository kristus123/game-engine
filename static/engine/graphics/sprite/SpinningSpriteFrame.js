export class SpinningSpriteFrame {
	constructor(position, imagePath, frame) {
		this.frame = new Sprite(position, imagePath, [frame])
		this.rotate = Math.floor(Math.random()*360)
	}

	update() {

	}

	draw(draw) {
		this.rotate+=Math.floor(Math.random()*20+1)/100

		if (this.frame.image.complete) {
			const frame = this.frame.frameSequence[this.frame.currentFrame]
			draw.ctx.save()
			draw.ctx.translate(this.frame.position.x+this.frame.position.width*0.5, this.frame.position.y +this.frame.position.height*0.5)
			draw.ctx.imageSmoothingEnabled = false

			draw.ctx.rotate(this.rotate)
			draw.ctx.drawImage(
				this.frame.image,
				frame.x * this.frame.width,
				frame.y * this.frame.height,
				this.frame.width,
				this.frame.height,
				this.frame.position.width*-0.5,
				this.frame.position.height *-0.5,
				this.frame.position.width,
				this.frame.position.height
			)
			draw.ctx.restore()
		}
	}
}
