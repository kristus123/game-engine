export class AsepriteLayerJson {
	constructor(json) {
	}



	forEachFrame(run) {
		for (let [key, f] of Object.entries(this.json.frames)) {
			const [layer,
				frame,
				tag] = key.split('_')

			run(layer, frame, f.frame.x, f.frame.y, f.frame.w, f.frame.h, tag)
		}

	}

}
