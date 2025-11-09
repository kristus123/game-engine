import { G } from '/static/engine/G.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { GridTile } from '/static/engine/graphics/grid/GridTile.js'; 
import { Palette } from '/static/engine/palette/Palette.js'; 
import { Menu } from '/static/game/memory_cards/Menu.js'; 

export class World {
	constructor() {


	//	new Menu()
		this.grassTile = new GridTile(Palette.fixedOffscreen(4000, 4000), G.image.grassTile)
	}

	update() {
		this.grassTile.update()
		console.log("A")
	}

	draw(draw) {
	}
}
