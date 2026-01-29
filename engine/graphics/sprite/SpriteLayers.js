export class SpriteLayers extends StaticGameObject {
	constructor(position, image, asepriteLayerJson, scale) {
		super(position)

		this.tags = {}
		this.layers = {}
		this.frames = {}

		this.width = null
		this.height = null

		asepriteLayerJson.forEachFrame((layer, frame, x, y, width, height, tag) => {
			this.tags[tag] ??= []

			this.position.width ??= this.width * Scale.vaue
			this.position.height ??= this.height * Scale.vaue

			this.width = width
			this.height = height

			if (!(layer in this.layers)) {
				this.layers[layer] = []
			}

			const xxx = Position(0, 0, width*Scale.value, height*Scale.value)
			const sprite = {
				position: xxx,
				x: x,
				y: y,
				width: width,
				height: height,
				picture: Picture(this.image, xxx),
			}

			this.layers[layer].push(sprite)
			this.tags[tag].push(sprite)
			this.frames[frame] = sprite
		})
	}

	forEachLayer(run) {
		for (const [layer, spriteFrames] of Object.entries(this.layers).reverse()) {
			run(layer, spriteFrames)
		}

	}

	update() {
		this.forEachLayer((layer, spriteFrames) => {
			if (layer == 'trees') {
				const p = spriteFrames[0]
				new Picture(this.image, p).draw()
			}
		})
	}

	draw(draw) {
	}
}
