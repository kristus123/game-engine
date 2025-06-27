export class Sprite {
	constructor(position, image, asepriteJson) {
		this.currentFrame = 0

		if (this.asepriteJson.tagPresent("idle")) {
			this.tag = "idle"
			this.activeFrames = this.asepriteJson.tags["idle"]
		}
		else if (this.asepriteJson.tagPresent("")) {
			this.tag = ""
			this.activeFrames = this.asepriteJson.tags[""]
		}
		else {
			throw new Error("invalid default tag for .aseprite")
		}


		const stopWatch = new StopWatch()
		stopWatch.start()

		this.localObjects = new LocalObjects([
			OnChange(() => stopWatch.time >= 300, () => {
				if (this.asepriteJson.totalFrames(this.tag) >= this.currentFrame + 1) {
					this.currentFrame = 0
				}
				else {
					this.currentFrame += 1
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
