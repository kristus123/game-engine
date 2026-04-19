export class AsepriteTilemapsJson {
	constructor(position, json) {
	}

	update() {
		for (const x of this.json.tilemaps) {
			if (x.layer == 'grass') {
				for (const tile of x.tiles) {
					const s = WorldPosition(
						tile.x * x.width * Scale.value, 
						tile.y * x.height * Scale.value, 
						x.width * Scale.value, 
						x.height * Scale.value,
					)

					if (Mouse.hovering(s)) {
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
