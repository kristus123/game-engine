export class SpriteFrameManager {
	constructor(fullJson) {

		this.currentTagFrame = 0

		this.asepriteJson = AsepriteJson(fullJson)

		this.tags = {}
		this.activeTag = "idle"

		this.type = "loop"

		this.onFinish = () => {}

		for (let [tag, value] of Object.entries(this.asepriteJson.tags)) {

			this.tags[tag] = {
				play: (onFinish=() => {}) => {
					this.currentTagFrame = 0
					this.activeTag = tag
					this.type = "play"
					this.onFinish = onFinish
					return this
				},

				loop: (onFinish=() => {}) => {
					this.currentTagFrame = 0
					this.activeTag = tag
					this.defaultTag = tag
					this.type = "loop"
					this.onFinish = onFinish
					return this
				},

				show: (frame) => {
					this.currentTagFrame = frame
					this.activeTag = tag
					this.defaultTag = tag
					this.type = "show"
					return this
				},
			}
		}

		const stopWatch = StopWatch().start()

		this.objects = Objects([
			OnTrue(() => stopWatch.time >= this.asepriteJson.tags[this.activeTag][this.currentTagFrame].duration, () => {
				if (this.type == "show") {
					// do nothing
				}
				else if (this.currentTagFrame + 1 >= this.asepriteJson.totalFrames(this.activeTag)) {
					this.currentTagFrame = 0

					if (this.type == "play") {
						this.activeTag = this.defaultTag
						this.type = "loop"
						this.onFinish()
					}
				}
				else {
					this.currentTagFrame += 1
				}

				stopWatch.restart()
			}),
		])
	}

	randomStartFrame() {
		this.currentTagFrame = Random.integerBetween(0, this.asepriteJson.totalFrames(this.activeTag)-1)
		return this
	}

	update() {
		this.objects.update()
	}
}
