export class TileSheet {
	constructor(json, image) {

		this.width = this.json.tilemaps[0].tileWidth
		this.height = this.json.tilemaps[0].tileHeight

		this.scaledWidth = this.width * Scale.value
		this.scaledHeight = this.height * Scale.value

		this.tiles = []
		this.tileTypes = {}

		for (const tileInfo of this.json.tilemaps[0].tiles) {

			const position = new Position(
				(tileInfo.x * Scale.value * this.width),
				(tileInfo.y * Scale.value * this.height),
				this.width * Scale.value,
				this.height * Scale.value)

			const singleTile = new SingleTile(this, tileInfo, position)

			if (!(this.tileTypes[tileInfo.i])) {
				this.tileTypes[tileInfo.i] = {
					x: tileInfo.x,
					y: tileInfo.y,
					singleTile: singleTile,
				}
			}

			this.tiles.push({
				i: tileInfo.i,
				singleTile: singleTile,
			})
		}
	}

	draw(draw, guiDraw) {
		for (const t of this.tiles) {
			t.singleTile.draw(draw, guiDraw)
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

}
