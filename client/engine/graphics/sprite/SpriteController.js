export class SpriteController extends Entity {
	constructor(position, layersImage, layersJson) {
		super(position)

		this.layers = {}

		this.totalFrames = null

		layersJson.frames.forEach((key, frameInfo) => {
			let [
				layer,
				frame,
				tag,
			] = key.split("_")
			const {x, y, w, h, duration} = frameInfo.frame
			frame = ConvertTo.integer(frame)

			// not sure if best approach to do - 1
			// currently lots of hacks with this caluclation. look at CurrentFrame.js
			this.totalFrames = frame - 1 // it will end on the last value which is the total frame

			this.width = w * Scale.value
			this.height = h * Scale.value

			this.layers[layer] ??= {}
			this.layers[layer][frame] = {
				frame: frame,
				tag: tag,
				duration: duration,
				picture: Picture(layersImage).crop(x, y, w, h),
			}
		})

		this.currentFrame = CurrentFrame(this.totalFrames)
	}

	getLayer(name) {
		const layer = this.layers[name][this.currentFrame.value].picture
		Assert.notNull(layer)
		return layer
	}

	update() {
		for (const [layer, frames] of this.layers.all) {
			const { frame, picture, duration, tag } = frames[this.currentFrame.value]

			picture.update(this.position)

			this.currentFrame.update(duration)
		}
	}
}
