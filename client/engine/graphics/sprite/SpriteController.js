export class SpriteController extends Entity {
	constructor(position, image, layersJson) {
		super(position)

		this.layers = {}

		this.totalFrames = null

		layersJson.frames.forEach((key, frameInfo) => {
			let [
				layer,
				frame,
				tag,
			] = key.split("_")
			frame = ConvertTo.integer(frame)

			// not sure if best approach to do - 1
			// currently lots of hacks with this caluclation. look at ActiveFrameHandler
			this.totalFrames = frame - 1 // it will end on the last value which is the total frame

			this.layers[layer] ??= {}

			this.width = frameInfo.frame.w * Scale.value
			this.height = frameInfo.frame.h * Scale.value

			const x = frameInfo.frame.x
			const y = frameInfo.frame.y
			const width = frameInfo.frame.w
			const height = frameInfo.frame.h

			this.layers[layer][frame] = {
				frame: frame,
				tag: tag,
				picture: Picture(image).crop(x, y, width, height),
				duration: frameInfo.duration,
			}
		})

		this.currentFrame = ActiveFrameHandler(this.totalFrames)
	}

	update(d) {
		for (const [layer, frames] of this.layers.all) {
			const { frame, picture, duration, tag } = frames[this.currentFrame.value]

			picture.update(this.position, d)

			this.currentFrame.update(duration)
		}
	}
}
