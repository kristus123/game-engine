export class Sprite {
	constructor(position, image, asepriteJson) {

		this.currentFrame = 0

		this.type = 'loop'

		for (let [tag, value] of Object.entries(asepriteJson.tags)) {
			this[tag] = {
				play: () => {
					this.currentFrame = 0
					this.activeTag = tag
					this.type = 'play'
				},
				loop: () => {
					this.currentFrame = 0
					this.activeTag = tag
					this.defaultTag = tag
					this.type = 'loop'
				},

				show: (frame) => {
					this.currentFrame = frame
					this.activeTag = tag
					this.defaultTag = tag
					this.type = 'show'
				},
			}
		}

		if (this.idle) {
			this.idle.loop()
		}
		else {
			throw new Error('invalid default tag for .aseprite')
		}

		const stopWatch = new StopWatch().start()

		this.localObjects = new LocalObjects([
			OnTrue(() => stopWatch.time >= 100, () => {
				if (this.type == 'show') {
					// do nothing
				}
				else if (this.currentFrame + 1 >= this.asepriteJson.totalFrames(this.activeTag)) {
					this.currentFrame = 0

					if (this.type == 'play') {
						this.activeTag = this.defaultTag
						this.type = 'loop'
					}
				}
				else {
					this.currentFrame += 1
				}

				stopWatch.restart()
			}),
		])
	}

	slices() {
		return this.asepriteJson.tags[this.activeTag][this.currentFrame].slices
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		const frame = this.asepriteJson.tags[this.activeTag][this.currentFrame]

		draw.sprite(this.position, frame, this.image)
	}
}
