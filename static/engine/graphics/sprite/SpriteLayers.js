const scale = 8

export class SpriteLayers extends StaticGameObject {
	constructor(position, image, asepriteLayerJson) {
		super(position)
		Camera.followInstantly(this.position.center)
		Html.fill([
			Html.p('Good morning'),
		])

		this.tags = {}
		this.layers = {}
		this.frames = {}

		this.width = null
		this.height = null

		asepriteLayerJson.forEachFrame((layer, frame, x, y, width, height, tag) => {
			this.tags[tag] = []

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

			this.frames[frame] = sprite


			this.position.width = this.width * scale
			this.position.height = this.height * scale
		})


		Camera.coverObject(this.position)
		Audio.play()
		Html.center([Html.button('Start', () => {
			Html.clear()
			setTimeout(() => {
				Html.lowerCenter([
					Html.div('big fade-in', [
						Html.p('I hope you are doing ok'),
						Html.p('Have fun climbing, remember to drink water'),
						Html.button('thank you', () => {
							Html.clear()
							Html.lowerCenter([
								Html.div('big fade-in', [
									Html.p('Now, just relax for a minute'),
									Html.button('I will', () => {
										Html.clear()
									}),
								]),
							])
						})
					]),
				])
			}, 1_000)
		})])
	}

	update() {
	}

	draw(draw, guiDraw) {

		for (const [layer, spriteFrame] of Object.entries(this.layers)) {
			const p = spriteFrame[0].position
			if (layer == 'skySmoke') {
				p.x += 0.02
				// p.xy(ParallaxTest(Mouse.position, 0.05))
			}
			else if (layer == 'clouds') {
				p.x += 0.4
				// p.xy(ParallaxTest(Mouse.position, 0.1))
			}

			else if (layer == 'backgroundTrees') {
				p.x += 0.1
				// p.xy(ParallaxTest(Mouse.position, 0.01))
			}

			else if (layer == 'sun') {
				p.x += 0.1
				// p.xy(ParallaxTest(Mouse.position, 0.001))
			}

			else if (layer == 'darkMountains') {
				p.x += 0.1
				// p.xy(ParallaxTest(Mouse.position, 0.001))
			}

			draw.sprite(p, spriteFrame[0], this.image)
		}

	}
}
