export class SpriteLayers extends Entity {
	constructor(sprite, d, position, image, layersJson) {
		super(position)
		this.layers = new Set()
		this._layers = {}
		this.tags = {}
		this.frames = {}
		const normalFrames = {}

		// First pass: collect all normal map frames
		AsepriteLayerJson(layersJson).forEachFrame((
			layer, frame, x, y, width, height,
		) => {
			if (layer.toLowerCase().includes("normal")) {
				normalFrames[frame] = { x, y, width, height }
			}
		})

		// Second pass: build layer pictures with normal data
		AsepriteLayerJson(layersJson).forEachFrame((
			layer, frame, x, y, width, height, tag,
		) => {
			//          console.log("Detected layer:", layer)
			this.layers.add(layer)
			this.tags[tag] ??= []
			this._layers[layer] ??= []
			this.width = width
			this.height = height
			const frameRect = { x, y, width, height }
			if (layer.toLowerCase().includes("normal")) {
				return
			}
			const normalFrame = normalFrames[frame] ?? null
			const picture = new LayerPicture(
				d,
				position,
				image,
				frameRect,
				normalFrame
					? { image, frame: normalFrame }
					: null
			)
			const frameData = {
				position: WorldPosition(
					x,
					y,
					width * Scale.value,
					height * Scale.value
				),
				x,
				y,
				width,
				height,
				picture,
			}
			this._layers[layer].push(frameData)
			this.tags[tag].push(frameData)
			this.frames[frame] = frameData
		})

		this.position.width = this.width * Scale.value
		this.position.height = this.height * Scale.value
		for (const layer of this.layers) {
			if (layer.toLowerCase().includes("normal")) {
				continue
			}
			Getter(this, layer, () =>
				this._layers[layer][sprite.currentTagFrame].picture
			)
		}
	}

	forEachLayer(run) {
		for (const [layer, spriteFrames] of Object.entries(this._layers)) {
			if (layer.toLowerCase().includes("normal")) {
				continue
			}
			run(layer, spriteFrames)
		}
	}

	update() {}
}
