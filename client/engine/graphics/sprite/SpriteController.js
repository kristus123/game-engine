export class SpriteController extends Entity {
	constructor(position, image, layersJson) {
		super(position)

		this.layers = {}

		this.totalFrames = null

		layersJson.frames.forEach((key, frameInfo) => {
			const [
				layer,
				frame,
				tag,
			] = key.split("_")


			this.totalFrames = frame - 1 // it will end on the last value which is the total frame

			this.layers[layer] ??= {}

			this.width = frameInfo.frame.w * Scale.value
			this.height = frameInfo.frame.h * Scale.value

			const x = frameInfo.frame.x
			const y = frameInfo.frame.y
			const width = frameInfo.frame.w
			const height = frameInfo.frame.h

			const pic = Picture(image).crop(x,y, width, height)

			this.layers[layer][frame] = {
				frame: frame,
				picture: pic,
				duration: frameInfo.duration,
			}
		})

		this.currentFrame = 0

		this.stopWatch = StopWatch().start()
	}

	update() {
		if (this.stopWatch.time >= 80) {
			if (this.currentFrame >= this.totalFrames) {
				this.currentFrame = 0
			}
			else {
				this.currentFrame += 1
			}

			this.stopWatch.restart()
		}

		for (const [layer, frames] of this.layers.all) {
			const {picture, duration} = frames[this.currentFrame]
			picture.update(this.position)
		}
	}
}
