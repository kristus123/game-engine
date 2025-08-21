export class Tilemaps {
	constructor() {
		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')


		this.width = this.jsonFile.tilemaps[0].tileWidth
		this.height = this.jsonFile.tilemaps[0].tileHeight

		this.test = G.Sprite.world(new Position(0, 0)).image

		this.tiles = []
		this.tileTypes = {}
		for (const e of this.jsonFile.tilemaps[0].tiles) {
			if (this.tileTypes[e.i]) {
			}
			else {
				this.tileTypes[e.i] = {
					x: e.x,
					y: e.y,
				}
			}

			this.tiles.push({
				i: e.i,
				position: new Position(
					(e.x * Scale.value * this.width),
					(e.y * Scale.value * this.height),
					this.width * Scale.value,
					this.height * Scale.value)
			})
		}

	}

	get turretTiles() {
		return this.tiles.filter(t => t.i == 4).map(t => t.position)
	}

	touchesTurretTiles(position) {
		return new Square(position, 10).touchesAny(this.turretTiles)
	}

	get enemyWalkTiles() {
		return this.tiles.filter(t => t.i == 1).map(t => t.position)
	}


	draw(draw, guiDraw) {
		console.log(this.tileTypes)

		// draw.drawPart(this.test, new Position(0,0))

		for (const p of this.tiles.filter(t => t.i == 4)) {
			// draw.rectangle(p.position)
		}

		this.extract(this.tileTypes[4], new Position(1*16*Scale.value, 1*16*Scale.value))
	}

	extract(tile, position) {
		const scaledWidth = this.width * Scale.value
		const scaledHeight = this.height * Scale.value

		const palette = Palette.fixedOffscreen(scaledWidth, scaledHeight)

		palette.ctx.drawImage(
			this.test,
			tile.x * this.width, tile.y * this.height, this.width, this.height,
			0, 0, scaledWidth, scaledHeight
		)

		Camera.palette.ctx.drawImage(palette.canvas, position.x, position.y)

		// Palette.apply(Camera.palette, [palette])
		// return palette
	}


}
