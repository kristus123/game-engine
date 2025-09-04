import { G } from '/static/engine/G.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { Palette } from '/static/engine/palette/Palette.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D1 } from '/static/engine/start/D1.js'; 

export class GrassGrid {
	constructor() {


		this.grid = new Grid()

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
				D1.text(snappedPosition, 'full')
			}
			else {
				this.grid.add(Mouse.position)
				this.grassPalette.draw.picture(snappedPosition, G.image.grassTile)
			}
		}
		else if (Mouse.rightDown) {
			this.grid.remove(Mouse.position)
			this.grassPalette.draw.erase(snappedPosition)
		}
	}
}
