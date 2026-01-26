/*
 * i don't like this code, it should be easy to do tile stuff, so there is room for improvement here
 * rename to tilemaps or smt else
*/

export class TileSheet {
	constructor(asepriteTilesJson, image, scale) {
		this.tiles = []
		this.tileTypes = {}

		for (const tileInfo of asepriteTilesJson.tilesForFrame(0)) {
			const position = Position(
				(tileInfo.x) * Scale.value * asepriteTilesJson.width * scale,
				(tileInfo.y+3) * Scale.value * asepriteTilesJson.height * scale, // i have no idea why i must do +num, the error might also be elsewhere. somewhere somehow things are being offset
				asepriteTilesJson.width * Scale.value * scale,
				asepriteTilesJson.height * Scale.value * scale,
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

	update() {
		for (const t of this.tiles) {
			if (t.i == 1) {
				if (Mouse.hovering(t.position)) {
					D1.rectangle(t.position)
				}
			}
		}
	}

	get turretTiles() {
		return this.tiles.filter(t => t.i == 4).map(t => t.position)
	}

	touchesTurretTiles(position) {
		return Square(position, 10).touchesAny(this.turretTiles)
	}

	get enemyWalkTiles() {
		return this.tiles.filter(t => t.i == 1).map(t => t.position)
	}
}

