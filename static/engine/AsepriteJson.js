export class AsepriteJson {
	constructor(json) {
		this.tags = {}

		for (const tag of [...new Set(Object.values(json.frames).map(frame => frame.filename))]) {
			this.tags[tag] = []
		}

		if (json.frames) {
			for (const f of json.frames) {
				this.tags[f.filename].push({
					x: f.frame.x,
					y: f.frame.y,
					width: f.frame.w,
					height: f.frame.h,
				})
			}
		}

		console.log(JSON.stringify(this.tags))
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

	get frameAmount() {
		return this.json.frames.length
	}

	get singleFrame() {
		return this.frameAmount == 1
	}


}
