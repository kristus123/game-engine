export class Tilemaps {
	constructor(asepriteTilesJson, image, layers, scale) {
		this.tiles = []

		for (const tileInfo of asepriteTilesJson.tilesForFrame(0)) {
			tileInfo.x += 0 // todo find out
			tileInfo.y += 0

			const position = Position(
				tileInfo.x * Scale.value * asepriteTilesJson.width * scale,
				tileInfo.y * Scale.value * asepriteTilesJson.height * scale,
				asepriteTilesJson.width * Scale.value * scale,
				asepriteTilesJson.height * Scale.value * scale)


			this.tiles.push(Tile(tileInfo.i, position, layers.layers.trees[0], scale))
		}
	}

	update() {
		this.layers.layers.trees[0].picture.setPixel(Position(0, 0))
		this.layers.layers.trees[0].picture.draw()
		for (const t of this.tiles) {
			if (t.index == 1) {
				if (Mouse.hovering(t.position)) {
					t.erase()
					//D1.box(t.position)
				}
			}
		}
	}

}

