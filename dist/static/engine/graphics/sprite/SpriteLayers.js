import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 

const scale = 8

export class SpriteLayers extends StaticGameObject {
	constructor(position, image, asepriteLayerJson) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(image, "argument image in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(asepriteLayerJson, "argument asepriteLayerJson in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.image = image; 
		this.asepriteLayerJson = asepriteLayerJson; 


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
			const p = spriteFrames[1].position

			if (layer == 'skySmoke') {
				p.x += 0.02
			}
			else if (layer == 'clouds') {
				p.x += 0.4
			}

			else if (layer == 'backgroundTrees') {
				p.x += 0.1
			}

			else if (layer == 'sun') {
				p.x += 0.1
			}

			else if (layer == 'darkMountains') {
				p.x += 0.1
			}

			draw.sprite(p, spriteFrames[1], this.image)

		})
	}
}
