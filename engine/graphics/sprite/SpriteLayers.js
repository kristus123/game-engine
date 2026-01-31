export class SpriteLayers extends StaticGameObject {
	constructor(sprite, d, position, image, layersJson, scale) {
		super(position)

		this.layers = new Set()
		this._layers = {}
		this.tags = {}
		this.frames = {}

		AsepriteLayerJson(layersJson).forEachFrame((
			layer, frame, x, y, width, height, tag
		) => {
			this.layers.add(layer)
			this.tags[tag] ??= []
			this._layers[layer] ??= []

			this.width = width
			this.height = height

			const xxx = Position(x, y, width*Scale.value, height*Scale.value)
			const yyy = {
				position: xxx,
				x: x,
				y: y,
				width: width,
				height: height,
				picture: LayerPicture(this.d, position, this.image, xxx),
			}

			this._layers[layer].push(yyy)
			this.tags[tag].push(yyy)
			this.frames[frame] = yyy
		})

		this.position.width = this.width * Scale.vaue
		this.position.height = this.height * Scale.vaue

		for (const layer of this.layers) {
			this[layer] = {
				draw: d => {
					this._layers[layer][sprite.currentFrame].picture.draw(d)
				}
			}
		}
	}

	forEachLayer(run) {
		for (const [layer, spriteFrames] of Object.entries(this._layers)) {
			run(layer, spriteFrames)
		}
	}

	update() {
		// seems like it can be empty, but if it is removed
		// it will use super's StaticGameObject.update
	}
}
