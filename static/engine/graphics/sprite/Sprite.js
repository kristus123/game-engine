export class Sprite {
	constructor(position, image, asepriteJson) {
		this.currentFrame = 0


		if (this.asepriteJson.tagPresent("idle")) {
			this.loop("idle")
		}
		else if (this.asepriteJson.tagPresent("")) {
			this.loop("")
		}
		else {
			throw new Error("invalid default tag for .aseprite")
		}

		this.type = "loop"

		const stopWatch = new StopWatch().start()

		this.localObjects = new LocalObjects([
			OnTrue(() => stopWatch.time >= 100, () => {

				if (this.currentFrame + 1 >= this.asepriteJson.totalFrames(this.activeTag)) {
					this.currentFrame = 0

					if (this.type == "play") {
						this.activeTag = this.defaultTag
						this.type = "loop"
					}
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
		this.activeTag = tag
		this.type = "play"
	}

	loop(tag) {
		this.currentFrame = 0
		this.activeTag = tag
		this.defaultTag = tag
		this.type = "loop"
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		draw.text(this.position, this.currentFrame)
		this.localObjects.draw(draw, guiDraw)

		const frame = this.asepriteJson.tags[this.activeTag][this.currentFrame]

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
