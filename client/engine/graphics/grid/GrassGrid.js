// TODO: Remove This Class After "GridMap.js" and "TileList.js" is fully implemented!
export class GrassGrid {
	constructor() {
		this.grid = Grid()

		this.grassPalette = Palette.fixedOffscreen(4000, 4000)
	}

	update() {
		D1.palette(this.grassPalette)

		const gridPosition = this.grid.toGridPosition(Mouse.position)
		const snappedPosition = this.grid.snappedPosition(Mouse.position)

		D1.transparentGreenRectangle(snappedPosition)

		for (const tile of this.grid.scaledTiles()) {
			if (Mouse.hovering(tile)) {
				D1.transparentRedRectangle(tile)
			}
		}

		if (Mouse.down) {
			if (this.grid.has(gridPosition)) {
				D1.text(snappedPosition, "full")
			}
			else {
				if (G.tile) {
					this.grid.add(Mouse.position)
					Audio.placeDirt()
					if (G.tile == "water") {
						this.grassPalette.draw.picture(snappedPosition, G.image.waterTile)
					}
					else {
						this.grassPalette.draw.picture(snappedPosition, G.image.grassTile)
					}
				}
			}
		}
		else if (Mouse.rightDown) {
			this.grid.remove(Mouse.position)
			this.grassPalette.draw.erase(snappedPosition)
		}
	}
}
