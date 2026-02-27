export class AsepriteJson {
	constructor(json) {
		this.tags = {}

		for (const tag of [...new Set(Object.values(json.frames).map(frame => frame.filename))]) {
if (tag == "") {
    // treat untagged frames as "idle"
}
			else {
				this.tags[tag] = []
			}
		}

		if (json.frames) {
			let frame = -1
			for (const f of json.frames) {
				frame += 1

				const sprite = {
					x: f.frame.x,
					y: f.frame.y,
					width: f.frame.w,
					height: f.frame.h,
					slices: [],
					duration: f.duration,
				}

				this.width = f.frame.w
				this.height = f.frame.h

				if (json.meta.slices) {
					for (const s of json.meta.slices) {

						const b = s.keys[frame].bounds
						sprite.slices.push({
							name: s.name,
							position: WorldPosition(b.x, b.y, b.w, b.h),
						})
					}
				}


const tagName = f.filename || "idle"
if (!this.tags[tagName]) this.tags[tagName] = []
this.tags[tagName].push(sprite)

			}
		}

	}

	tagPresent(tag) {
		return tag in this.tags
	}

	totalFrames(tag) {
		return this.tags[tag].length
	}

	get singleFrame() {
		return this.json.frames.length == 1
	}

}
