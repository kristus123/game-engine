export class TileSheet {
	constructor(asepriteTilesJson, image) {

		this.scaledWidth = this.asepriteTilesJson.width * Scale.value
		this.scaledHeight = this.asepriteTilesJson.height * Scale.value

		this.tiles = []
		this.tileTypes = {}

		this.extras = []

		for (const tileInfo of asepriteTilesJson.tilesForFrame(0)) {
			this.tileTypes[tileInfo.i] ??= {
				x: tileInfo.x,
				y: tileInfo.y,
				singleTile: p => new SingleTile(image, asepriteTilesJson, tileInfo, this.gridPosition(p)),
			}
		}

		for (const tileInfo of asepriteTilesJson.tilesForFrame(0)) {
			if (this.tileTypes[tileInfo.i]) {
				this.tiles.push({
					i: tileInfo.i,
					position: this.gridPosition(tileInfo),
					singleTile: this.singleTile(tileInfo.i, tileInfo),
				})
			}
		}
	}

	singleTile(index, position) {
		return this.tileTypes[index].singleTile(position)
	}

	gridPosition(position) {
		return new Position(
			(position.x * Scale.value * this.asepriteTilesJson.width),
			(position.y * Scale.value * this.asepriteTilesJson.height),
			this.asepriteTilesJson.width * Scale.value,
			this.asepriteTilesJson.height * Scale.value)
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
