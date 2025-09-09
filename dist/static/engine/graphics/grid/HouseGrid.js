import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/assertions/a.js'; 
import { Sound } from '/static/engine/audio/Sound.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D1 } from '/static/engine/start/D1.js'; 
import { Scale } from '/static/game/Scale.js'; 

export class HouseGrid {
	constructor() {


		this.grid = new Grid()

		this.position = new Position(0, 0, 96*Scale.value, 96*Scale.value) // 96x96 is the sprite size of G.image.house
	}

	update() {
		this.position.xy(this.grid.snappedPosition(Mouse.position))


		if (this.grid.availableArea(this.grid.area(this.position))) {
			if (Mouse.down) {
				this.grid.placeArea(this.grid.area(this.position))
				Sound.click()
			}
		}

		for (const p of this.grid.area(this.position)) {
			D1.rectangle(p, 'green')
		}

		for (const p of this.grid.scaledTiles()) {
			D1.rectangle(p, 'brown')
		}

		D1.picture(this.position, G.image.house)
	}
}
