const scale = 8

export class SpriteLayers extends StaticGameObject {
	constructor(position, image, asepriteLayerJson) {
		super(position)

		this.tags = {}
		this.layers = {}
		this.frames = {}

		this.width = null
		this.height = null

		asepriteLayerJson.forEachFrame((layer, frame, x, y, width, height, tag) => {
			this.tags[tag] ??= []

			this.position.width ??= this.width * scale
			this.position.height ??= this.height * scale

			this.width = width
			this.height = height

			if (!(layer in this.layers)) {
				this.layers[layer] = []
			}

			const sprite = {
				position: new Position(0, 0, width*scale, height*scale),
				x: x,
				y: y,
				width: width,
				height: height,
			}

			this.layers[layer].push(sprite)
			this.tags[tag].push(sprite)
			this.frames[frame] = sprite
		})
	}

	forEachLayer(run) {
		for (const [layer, spriteFrames] of Object.entries(this.layers)) {
			run(layer, spriteFrames)
		}

	}

	update() {
	}

	draw(draw, guiDraw) {
		this.forEachLayer((layer, spriteFrames) => {
			const p = spriteFrames[0].position

			if (layer == 'clouds') {
				p.x -= 1
			}

			draw.sprite(p, spriteFrames[0], this.image)

		})
	}
}
