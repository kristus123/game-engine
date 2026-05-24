export class SpriteController extends Entity {
	constructor(position, layersImage, layersJson, fullJson, spriteName) {
		super(position)

		this.layers = {}
		this.tagFrames = {}
		this.currentFrame = 0

		console.log("")
		console.log("")
		console.log("")
		console.log("")
		console.log("___")
		this.slices = []
		if (!fullJson.meta.slices.empty) {
			console.log(spriteName)
			for (const x of fullJson.meta.slices) {
				console.log(x.name)
				const slice = {
					name: x.name,
				}
				for (const y of x.keys) {
					const p = y.bounds
					slice.pixelPosition = WorldPosition(p.x, p.y, p.w, p.h)
				}

				this.slices.add(slice)
			}
		}
		console.log("___")
		console.log("")
		console.log("")
		console.log("")
		console.log("")

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
				picture: Picture(layersImage).crop(x, y, w, h),
			}

			this.tagFrames[tag] ??= []
			this.tagFrames[tag].push(frame)
		})

		this.activeTag = "idle"
		this.looping = true

		this.stopWatch = StopWatch().start()
	}

	get collider() {
		for (const c of this.slices) {
			const s = c.pixelPosition
			console.log(s)
			return WorldPosition(
				this.position.x + (s.x * Scale.value),
				this.position.y,
				s.width * Scale.value,
				s.height * Scale.value,
			)
		}
	}

	tint(r, g, b, a) {
		for (const picture of this.getAllPicture()) {
			picture.tint(r, g, b, a)
		}
	}

	mirror() {
		for (const picture of this.getAllPicture()) {
			picture.mirror()
		}
	}

	changeColor(colorMap) {
		for (const picture of this.getAllPicture()) {
			picture.changeColor(colorMap)
		}
	}

	reset() {
		for (const picture of this.getAllPicture()) {
			picture.reset()
		}
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

	*getAllPicture() {
		for (const frames of Object.values(this.layers)) {
			for (const { picture } of Object.values(frames)) {
				yield picture
			}
		}
	}

	update() {
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
