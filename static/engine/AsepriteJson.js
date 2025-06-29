export class AsepriteJson {
	constructor(position, json) {
		this.tags = {}

		for (const tag of [...new Set(Object.values(json.frames).map(frame => frame.filename))]) {
			if (tag == '') {
				throw new Error(`${json.meta.image} must have a tag set`)
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
				}

				if (json.meta.slices) {
					for (const s of json.meta.slices) {

						const b = s.keys[frame].bounds
						sprite.slices.push({
							name: s.name,
							position: position.offset(b.x, b.y, b.w, b.h),
						})
					}
				}

				this.tags[f.filename].push(sprite)
			}
		}

		console.log(this.tags)
	}

	tagPresent(tag) {
		return tag in this.tags
	}

	get width() {
		return this.json.meta.size.w

	}

	get height() {
		return this.json.meta.size.h
	}

	totalFrames(tag) {
		return this.tags[tag].length
	}

	get singleFrame() {
		return this.json.frames.length == 1
	}


}
