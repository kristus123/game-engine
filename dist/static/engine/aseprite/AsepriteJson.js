import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class AsepriteJson {
	constructor(json) {

				AssertNotNull(json, "argument json in " + this.constructor.name + ".js should not be null")
			
		this.json = json; 

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

				this.width = f.frame.w
				this.height = f.frame.h

				if (json.meta.slices) {
					for (const s of json.meta.slices) {

						const b = s.keys[frame].bounds
						sprite.slices.push({
							name: s.name,
							position: new Position(b.x, b.y, b.w, b.h),
						})
					}
				}

				this.tags[f.filename].push(sprite)
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
