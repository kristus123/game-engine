/*
 * i don't like this code, it should be easy to do tile stuff, so there is room for improvement here
*/

export class TileSheet {
	constructor(asepriteTilesJson, image) {
		this.tiles = []
		this.tileTypes = {}

		for (const tileInfo of asepriteTilesJson.tilesForFrame(0)) {
			const position = new Position(
				(tileInfo.x) * Scale.value * asepriteTilesJson.width,
				(tileInfo.y+2) * Scale.value * asepriteTilesJson.height, // i have no idea why i must do +2, the error might also be elsewhere. somewhere somehow things are being offset
				asepriteTilesJson.width * Scale.value,
				asepriteTilesJson.height * Scale.value
			)

			this.tileTypes[tileInfo.i] ??= {
				x: tileInfo.x,
				y: tileInfo.y,
				singleTile: p => new SingleTile(image, asepriteTilesJson, tileInfo, p)
			}

			this.tiles.push({
				i: tileInfo.i,
				position,
				singleTile: this.tileTypes[tileInfo.i].singleTile(position)
			})
		}
	}

	draw() {
		for (const t of this.tiles) {
			if (t.i == 4) {
				// t.singleTile.draw()
				// Draw.rectangle(t.position)
			}
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

