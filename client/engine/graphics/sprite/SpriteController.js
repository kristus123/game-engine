export class SpriteController extends Entity {
	constructor(position, layersImage, layersJson) {
		super(position)

		this._layers = {}

		this.totalFrames = null

		layersJson.frames.forEach((key, frameInfo) => {
			let [
				layer,
				frame,
				tag,
			] = key.split("_")
			frame = ConvertTo.integer(frame)

			// not sure if best approach to do - 1
			// currently lots of hacks with this caluclation. look at CurrentFrame.js
			this.totalFrames = frame - 1 // it will end on the last value which is the total frame

			this._layers[layer] ??= {}

			this.width = frameInfo.frame.w * Scale.value
			this.height = frameInfo.frame.h * Scale.value

			const x = frameInfo.frame.x
			const y = frameInfo.frame.y
			const width = frameInfo.frame.w
			const height = frameInfo.frame.h

			this._layers[layer][frame] = {
				frame: frame,
				tag: tag,
				picture: Picture(layersImage).crop(x, y, width, height),
				duration: frameInfo.duration,
			}
		})

		this._currentFrame = CurrentFrame(this.totalFrames)
	}

	getLayer(name) {
		return Assert.notNull(this._layers[name][this._currentFrame.value].picture)
	}

	update() {
		for (const [layer, frames] of this._layers.all) {
			const { frame, picture, duration, tag } = frames[this._currentFrame.value]

			picture.update(this.position)

			this._currentFrame.update(duration)
		}
	}
}
