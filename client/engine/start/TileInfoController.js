export class TileInfoController {
	constructor(position, json) {
	}

	update() {
		for (const x of this.json.tilemaps) {
			if (x.layer == "grass") {
				for (const tile of x.tiles) {
					const t = WorldPosition(
						tile.x * x.tileWidth * Scale.value,
						tile.y * x.tileHeight * Scale.value,
						x.tileWidth * Scale.value,
						x.tileHeight * Scale.value)

					if (Mouse.hovering(t)) {
						D1.rectangle(t, "green")
					}
				}
			}
		}
	}
}
