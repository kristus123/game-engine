const scale = 8

export class Tilemaps {
	constructor() {
		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')


		this.width = this.jsonFile.tilemaps[0].tileWidth
		this.height = this.jsonFile.tilemaps[0].tileHeight

		this.tiles = []
		for (const e of this.jsonFile.tilemaps[0].tiles) {
			this.tiles.push({
				i: e.i,
				position: new Position(
					(e.x * scale * this.width),
					(e.y * scale * this.height),
					this.width * scale,
					this.height * scale,
				)
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
		for (const p of this.tiles.filter(t => t.i == 4)) {
			draw.rectangle(p.position)
		}
	}

}
