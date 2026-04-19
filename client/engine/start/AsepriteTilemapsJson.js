export class AsepriteTilemapsJson {
	constructor(position, json) {
	}

	update() {
		for (const x of this.json.tilemaps) {
			if (x.layer == 'grass') {
				for (const tile of x.tiles) {
					const s = WorldPosition(
						tile.x * x.tileWidth * Scale.value, 
						tile.y * x.tileHeight * Scale.value, 
						x.tileWidth * Scale.value, 
						x.tileHeight * Scale.value,
					)

					if (Mouse.hovering(s)) {
						console.log(tile.i == 4)
						D1.rectangle(s, 'green')
					}
					else {
						// D1.rectangle(s, 'blue')
					}
				}
				
			}
		}
	}
}
