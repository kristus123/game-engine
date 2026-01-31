export class Tilemaps {
	constructor(sprite, tilemapsJson, layers, scale) {
		this.tiles = []

		const tilesJson = new AsepriteTilemapsJson(tilemapsJson)

		for (const tileInfo of tilesJson.tilesForFrame(0)) {
			// if there is no tile at 0x0 in aseprite, something strnage happens
			tileInfo.x += 0
			tileInfo.y += 0

			const position = Position(
				tileInfo.x * Scale.value * tilesJson.width * scale,
				tileInfo.y * Scale.value * tilesJson.height * scale,
				tilesJson.width * Scale.value * scale,
				tilesJson.height * Scale.value * scale)


			this.tiles.push(Tile(
				tileInfo.i,
				position,
				Position(
					tileInfo.x * tilesJson.width,
					tileInfo.y * tilesJson.height,
					tilesJson.width,
					tilesJson.height),

				layers.trees,
				scale))
		}
	}

	update() {
		for (const t of this.tiles) {
			if (t.index == 1 && Mouse.hovering(t.position)) {
				if (Mouse.down) {
					t.erase()
				}
			}
		}
	}
}

