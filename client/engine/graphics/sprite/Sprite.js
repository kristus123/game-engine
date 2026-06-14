export class Sprite extends Entity {
	constructor(position, layersImage, layersJson, fullJson, groupsJson, spriteName) {
		super(position)
		this.groupInfo = {}
		for (const x of groupsJson.meta.layers) {
			if (x.group) {
				console.log(x)
				this.groupInfo[x.name] = x.group

			}
		}

		this.layers = {}
		this.tagFrames = {}
		this.currentFrame = 0

		this.slices = []
		if (!fullJson.meta.slices.empty) {
			for (const x of fullJson.meta.slices) {
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
		this.collider = WorldPosition(0, 0, 0, 0)
		this.updateColliderPosition()
	}

	updateColliderPosition() {
		for (const c of this.slices) {
			const s = c.pixelPosition
			this.collider.x = this.position.x + (s.x * Scale.value)
			this.collider.y = this.position.y + (s.y * Scale.value)
			this.collider.width = s.width * Scale.value
			this.collider.height = s.height * Scale.value
			break
		}
	}
	
	shadow(r = 0, g = 0, b = 0, a = 1.0) {
		for (const picture of this.getAllPicture()) {
			picture.shadow(r, g, b, a)
		}
	}

	updateShadow(lightPos) {
		for (const picture of this.getAllPicture()) {
			picture.updateShadow(this.position, lightPos)
		}
	}

	flicker(intensity, r = 0, g = 0, b = 0) {
		for (const picture of this.getAllPicture()) {
			picture.flicker(intensity, r, g, b)
		}
	}

	shake(intensity, durationSeconds) {
		for (const picture of this.getAllPicture()) {
			picture.shake(intensity, durationSeconds)
		}
	}

	tint(r, g, b, a) {
		for (const picture of this.getAllPicture()) {
			picture.tint(r, g, b, a)
		}
	}

	mirrorX() {
		for (const picture of this.getAllPicture()) {
			picture.mirrorX()
		}
	}

	mirrorY() {
		for (const picture of this.getAllPicture()) {
			picture.mirrorY()
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

	group(layer) { // we use groups in aseprite
		return Assert.value(this.groupInfo[layer], `${this.spriteName}.aseprite needs to have a Draw order group`)
	}

	update() {
		this.updateColliderPosition()
		for (const { layer, frames, frame, tag, duration, picture } of this.getAllStuff(this.currentFrame)) {

			if (this.group(layer) == "D1") {
				picture.update(this.position, D1)
			}
			else if (this.group(layer) == "D2") {
				picture.update(this.position, D2)
			}
			else if (this.group(layer) == "D3") {
				picture.update(this.position, D3)
			}
			else {
				throw new Error("Unsupported xxlsakdjflaksdjf")
			}

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
