const scale = 8

export class Sprite {
	constructor(position, image, asepriteJson) {
		this.position.width = asepriteJson.width * scale
		this.position.height = asepriteJson.height * scale

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

		this.slices = this.asepriteJson.tags[this.activeTag][this.currentFrame].slices.map(s => {
			const p = s.position

			p.x = (p.x * scale) + this.position.x
			p.y = (p.y * scale) + this.position.y

			p.width *= scale
			p.height *= scale

			return s
		})
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
