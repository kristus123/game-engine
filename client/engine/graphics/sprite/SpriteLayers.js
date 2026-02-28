export class SpriteLayers extends Entity {
	constructor(sprite, d, position, image, layersJson) {
		super(position)
		this.layers = new Set()
		this._layers = {}
		this.tags = {}
		this.frames = {}

		const normalFrames = this.collectNormalFrames(layersJson)
		this.buildLayers(sprite, d, position, image, layersJson, normalFrames)

		this.position.width = this.width * Scale.value
		this.position.height = this.height * Scale.value
	}

	collectNormalFrames(layersJson) {
		const normalFrames = {}
		AsepriteLayerJson(layersJson).forEachFrame((layer, frame, x, y, width, height) => {
			if (layer == "normalMap") {
				normalFrames[frame] = { x, y, width, height }
			}
		})
		return normalFrames
	}

	buildLayers(sprite, d, position, image, layersJson, normalFrames) {
		AsepriteLayerJson(layersJson).forEachFrame((layer, frame, x, y, width, height, tag) => {
			if (layer == "normalMap") {
				return
			}

			this.layers.add(layer)
			this.tags[tag] ??= []
			this._layers[layer] ??= []
			this.width = width
			this.height = height

			const frameRect = { x, y, width, height }
			const normalFrame = normalFrames[frame] ?? null
			const picture = new LayerPicture(
				d,
				position,
				image,
				frameRect,
				normalFrame ? { image, frame: normalFrame } : null
			)

			const frameData = {
				position: WorldPosition(x, y, width * Scale.value, height * Scale.value),
				x, y, width, height, picture,
			}

			this._layers[layer].push(frameData)
			this.tags[tag].push(frameData)
			this.frames[frame] = frameData
		})

		for (const layer of this.layers) {
			Getter(this, layer, () => this._layers[layer][sprite.currentTagFrame].picture)
		}
	}

	forEachLayer(run) {
		for (const [layer, spriteFrames] of Object.entries(this._layers)) {
			run(layer, spriteFrames)
		}
	}

	update() {}
}
