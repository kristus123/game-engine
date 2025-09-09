import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Scale } from '/static/game/Scale.js'; 
import { SingleTile } from '/static/game/tiles/SingleTile.js'; 

/*
 * i don't like this code, it should be easy to do tile stuff, so there is room for improvement here
*/

export class TileSheet {
	constructor(asepriteTilesJson, image) {

				AssertNotNull(asepriteTilesJson, "argument asepriteTilesJson in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(image, "argument image in " + this.constructor.name + ".js should not be null")
			
		this.asepriteTilesJson = asepriteTilesJson; 
		this.image = image; 

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

	draw(draw) {
		for (const t of this.tiles) {
			if (t.i == 4) {
				// t.singleTile.draw(draw)
				// draw.rectangle(t.position)
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

