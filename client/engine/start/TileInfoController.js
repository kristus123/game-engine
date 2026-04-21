export class TileInfoController {
	constructor(position, json) {

		this.tiles = {}

		for (const x of json.tilemaps) {
			this.tiles[x.layer] = {}

			for (const t of x.tiles) {
				const frame = ConvertTo.integer(t.f)

				this.tiles[x.layer][frame] ??= []

				this.tiles[x.layer][frame].push({
					index: t.i,
					position: WorldPosition(
						t.x * x.tileWidth * Scale.value,
						t.y * x.tileHeight * Scale.value,
						x.tileWidth * Scale.value,
						x.tileHeight * Scale.value),
				})
			}
		}
	}

	touches(layer, index, position) {
		for (const t of this.tiles[layer][0]) { // currently always uses frame 0
			if (t.index == index && t.position.touches(position)) {
				D1.text(t.position, t.index)
				return true
			}
		}

		return false
	}

	update() {
	}
}
