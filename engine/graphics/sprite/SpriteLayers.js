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

			const sprite = {
				position: Position(0, 0, width*Scale.value, height*Scale.value),
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
		this.forEachLayer((layer, spriteFrames) => {
			const p = spriteFrames[0].position

			p.x -= Random.integerBetween(-1, 2) 
			p.y -= Random.integerBetween(-1, 2) 

			D1.sprite(p, spriteFrames[0], this.image)

		})
	}

	draw(draw) {
	}
}
