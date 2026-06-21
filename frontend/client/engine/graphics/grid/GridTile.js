export class GridTile {
	constructor(pal, spr) {
		this.grid = Grid()
		this.palette = pal
		this.sprite = spr
	}

	update() {
		D1.palette(this.palette)

		const gridPosition = this.grid.toGridPosition(Mouse.position)
		const snappedPosition = this.grid.snappedPosition(Mouse.position)
		D1.grey(snappedPosition)

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
					this.palette.draw.picture(snappedPosition, this.sprite)
				}
			}
		}
		else if (Mouse.rightDown) {
			this.grid.remove(Mouse.position)
			this.palette.draw.erase(snappedPosition)
		}
	}
}
