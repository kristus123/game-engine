// todo: this needs some comments for documentation because the api is so complex

export class SpriteController extends StaticGameObject {
	constructor(position, picture, asepriteJson, layers, tilemaps, scale=1) {
		super(position)

		this.position.width = asepriteJson.width * Scale.value * scale
		this.position.height = asepriteJson.height * Scale.value * scale

		this.currentFrame = 0
		this.tags = {}

		this.type = 'loop'

		this.onFinish = () => {}

		for (let [tag, value] of Object.entries(asepriteJson.tags)) {
			this[tag] = {
				play: (onFinish=() => {}) => {
					this.currentFrame = 0
					this.activeTag = tag
					this.type = 'play'
					this.onFinish = onFinish
					return this
				},
				loop: (onFinish=() => {}) => {
					this.currentFrame = 0
					this.activeTag = tag
					this.defaultTag = tag
					this.type = 'loop'
					this.onFinish = onFinish
					return this
				},

				show: (frame) => {
					this.currentFrame = frame
					this.activeTag = tag
					this.defaultTag = tag
					this.type = 'show'
					return this
				},
			}

			this.tags[tag] = this[tag]
		}

		if (this.idle) {
			this.idle.loop()
		}
		else {
			throw new Error('invalid default tag for .aseprite. idle must be present')
		}

		const stopWatch = StopWatch().start()

		this.localObjects = LocalObjects([
			OnTrue(() => stopWatch.time >= 100, () => {
				if (this.type == 'show') {
					// do nothing
				}
				else if (this.currentFrame + 1 >= this.asepriteJson.totalFrames(this.activeTag)) {
					this.currentFrame = 0

					if (this.type == 'play') {
						this.activeTag = this.defaultTag
						this.type = 'loop'
						this.onFinish()
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

			p.x = (p.x * Scale.value) + this.position.x
			p.y = (p.y * Scale.value) + this.position.y

			p.width *= Scale.value
			p.height *= Scale.value

			return s
		})
	}


	randomStartFrame() {
		this.currentFrame = Random.integerBetween(0, this.asepriteJson.totalFrames(this.activeTag)-1)
		return this
	}

	update() {
		this.localObjects.update()

		this.localObjects.draw(D1)

		const frame = this.asepriteJson.tags[this.activeTag][this.currentFrame]

		//D1.sprite(this.position, frame, this.image)
		this.picture.update(this.position, frame)
	}
}
