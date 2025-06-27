export class AsepriteJson {
	constructor(json) {
		this.tags = {}


		console.log(json.meta.image)
		console.log(json)
		if (json.meta.frameTags) {
			for (const t of json.meta.frameTags) {
				tags[t.name] = {
					start: this['from'],
					end: this['to'],
				}

			}
		}


		console.log(this.tags)

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
