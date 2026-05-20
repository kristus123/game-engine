export class SpriteController extends Entity {
	constructor(position, layersImage, layersJson, spriteName) {
		super(position)

		this.layers = {}
		this.tagFrames = {}
		this.currentFrame = 0

		layersJson.frames.forEach((key, frameInfo) => {
			let [
				layer,
				frame,
				tag,
			] = key.split("_")

			frame = Always.integer(frame)

			const { x, y, w, h } = frameInfo.frame
			const duration = frameInfo.duration

			// not sure if best approach to do - 1
			// currently lots of hacks with this caluclation. look at CurrentFrame.js

			this.width = w * Scale.value
			this.height = h * Scale.value

			this.layers[layer] ??= {}
			this.layers[layer][frame] = {
				frame: frame,
				tag: tag,
				duration: duration,
				picture: Picture(layersImage).crop(x, y, w, h).changeColor({ "rgb(171,161,92)": {
					r: 0,
					g: 0,
					b: 255
				} }),
			}

			this.tagFrames[tag] ??= []
			this.tagFrames[tag].push(frame)
		})

		this.activeTag = "idle"
		this.looping = true

		this.stopWatch = StopWatch().start()
	}

	playTag(tag) {
		this.activeTag = tag
		this.looping = false

		this.stopWatch.restart()
		this.currentFrame = this.tagFrames[tag].first

		return this
	}

	loopTag(tag) {
		this.activeTag = tag
		this.looping = true

		this.stopWatch.restart()
		this.currentFrame = this.tagFrames[tag].first

		return this
	}

	* getAllStuff(wantedFrame) {
		for (const [layer, frames] of this.layers.all) {
			const { frame, tag, duration, picture } = frames[wantedFrame]

			yield { layer, frames, frame, tag, duration, picture }
		}
	}

	update() {
		console.log(this.spriteName)
		if (this.spriteName == "player") {
			console.log(this.currentFrame)

		}
		for (const { layer, frames, frame, tag, duration, picture } of this.getAllStuff(this.currentFrame)) {
			picture.update(this.position)

			if (this.stopWatch.time >= duration) {
				this.stopWatch.restart()

				if (this.tagFrames[this.activeTag].includes(this.currentFrame+1)) {
					this.currentFrame += 1
				}
				else if (this.looping) {
					this.loopTag(this.activeTag)
				}
				else {
					this.loopTag("idle")
				}
			}
		}
	}
}
