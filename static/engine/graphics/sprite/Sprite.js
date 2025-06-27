export class Sprite {
	constructor(position, image, asepriteJson, currentAnimation = "") {
	constructor(position, image, asepriteJson) {
		this.currentFrame = 0

		if (this.asepriteJson.tagPresent("idle")) {
			this.activeFrames = this.asepriteJson.tags["idle"]
		}
		else if (this.asepriteJson.tagPresent("")) {
			this.activeFrames = this.asepriteJson.tags[""]
		}


		const stopWatch = new StopWatch()
		stopWatch.start()

		this.localObjects = new LocalObjects([
			OnChange(() => stopWatch.time >= 100, () => {
				console.log("hei")
				this.currentFrame = (this.currentFrame + 1) % this.activeFrames.length
				if (this.asepriteJson.totalFrames) {
					
				}
				
				stopWatch.restart()
			}),
		])
	}

	play(tag) {
		this.currentFrame = 0
		this.activeFrames = this.asepriteJson.tags[tag]
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

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
