export class AsepriteLayerJson {
	constructor(json) {
	}

	forEachFrame(run) {
		this.json.frames.forEach((key, f) => {
			const [
				layer,
				frame,
				tag
			] = key.split("_")

			run(layer, frame, f.frame.x, f.frame.y, f.frame.w, f.frame.h, tag)
		})
	}

}