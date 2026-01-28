export class Tilemap {
	constructor(asepriteTilesJson, image, scale) {
		this.tiles = []
		this.tileTypes = {}

		for (const tileInfo of asepriteTilesJson.tilesForFrame(0)) {
			tileInfo.x += 1
			tileInfo.y += 0
			const position = Position(
				(tileInfo.x) * Scale.value * asepriteTilesJson.width * scale,
				(tileInfo.y+0) * Scale.value * asepriteTilesJson.height * scale, // i have no idea why i must do +num, the error might also be elsewhere. somewhere somehow things are being offset  ,aybe because of the height of the tilemaps that is set in aseprite
				asepriteTilesJson.width * Scale.value * scale,
				asepriteTilesJson.height * Scale.value * scale)

			this.tileTypes[tileInfo.i] ??= {
				x: tileInfo.x,
				y: tileInfo.y,
				singleTile: p => new SingleTile(image, asepriteTilesJson, tileInfo, p)
			}

			console.log(tileInfo)

			this.tiles.push({
				i: tileInfo.i,
				tp: Position(
					tileInfo.x * asepriteTilesJson.width,
					tileInfo.y * asepriteTilesJson.height,
					//asepriteTilesJson.width,
					//asepriteTilesJson.height,
				),
				position,
				singleTile: this.tileTypes[tileInfo.i].singleTile(position),
				pp(x, y) {
					return Position(
						this.tp.x + x,
						this.tp.y + y)
				},
				pixelPosition(x, y) {
					return Position(
						position.x + (x*Scale.value*scale),
						position.y + (y*Scale.value*scale),
						Scale.value*scale,
						Scale.value*scale)
				},
			})
		}
	}

	update() {
	}

}

