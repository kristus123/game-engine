import { Random } from '/static/engine/Random.js'; 
import { StopWatch } from '/static/engine/StopWatch.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 
import { D1 } from '/static/engine/start/D1.js'; 
import { Scale } from '/static/game/Scale.js'; 

// todo: this needs some comments for documentation because the api is so complex

export class Sprite extends StaticGameObject {
	constructor(position, image, asepriteJson) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(image, "argument image in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(asepriteJson, "argument asepriteJson in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.image = image; 
		this.asepriteJson = asepriteJson; 


		this.position.width = asepriteJson.width * Scale.value
		this.position.height = asepriteJson.height * Scale.value

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

		const stopWatch = new StopWatch().start()

		this.localObjects = new LocalObjects([
			new OnTrue(() => stopWatch.time >= 100, () => {
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

		D1.sprite(this.position, frame, this.image)
	}
}
