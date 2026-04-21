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

		console.log(this.tiles)
	}

	touches(layer, index, position) {
		for (const t of this.tiles[layer][0]) {
			console.log(t.position)
			D1.text(this.position, t.index)
			if (t.index == index && position.touches(t.position)) {
				D1.rectangle(t.position)
				return true
			}
		}

		return false
	}

	update() {
	}
}
