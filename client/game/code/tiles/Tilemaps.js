// if there is no tile at 0x0 in aseprite, something strnage happens
// quick fix is to just always place something in 0x0

export class Tilemaps {
	constructor(sprite, tilemapsJson, layers, scale) {
		this.tiles = Objects([])

		const tilesJson = new AsepriteTilemapsJson(tilemapsJson)

		for (const tileInfo of tilesJson.tilesForFrame(0)) {
			const position = WorldPosition(
				tileInfo.x * Scale.value * tilesJson.width * scale,
				tileInfo.y * Scale.value * tilesJson.height * scale,
				tilesJson.width * Scale.value * scale,
				tilesJson.height * Scale.value * scale)

			this.tiles.push(Tile(
				tileInfo.i,
				position,
				WorldPosition(
					tileInfo.x * tilesJson.width,
					tileInfo.y * tilesJson.height,
					tilesJson.width,
					tilesJson.height
				),
				layers.trees,
				scale))
		}
	}

	update() {
	}
}
