export class SpriteController extends StaticGameObject {
	constructor(d, position, fullImage, fullJson, layersImage, layersJson, tilemapsJson, scale=1) {
		super(position)

		this.currentFrame = 0


		this.spritePicture = SpritePicture(d, this, position, fullImage)
		this.asepriteJson = new AsepriteJson(fullJson)

		this.layers = new SpriteLayers(
			this, d, position, layersImage, layersJson, scale)

		if (tilemapsJson) {
			this.tilemaps = new Tilemaps(
				this, tilemapsJson, this.layers, scale)
		}

		this.position.width = this.asepriteJson.width * Scale.value * scale
		this.position.height = this.asepriteJson.height * Scale.value * scale


		this.tags = {}

		this.type = 'loop'

		this.onFinish = () => {}

		for (let [tag, value] of Object.entries(this.asepriteJson.tags)) {
			this.tags[tag] = {
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
		}

		if (this.tags.idle) {
			this.tags.idle.loop()
		}
		else {
			throw new Error('idle tag missing from .aseprite file')
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
	}


	randomStartFrame() {
		this.currentFrame = Random.integerBetween(0, this.asepriteJson.totalFrames(this.activeTag)-1)
		return this
	}

	update() {
		this.localObjects.update()

		this.spritePicture.update()
	}
}
