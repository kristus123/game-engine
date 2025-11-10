import { G } from '/static/engine/G.js'; 
import { GrassGrid } from '/static/engine/graphics/grid/GrassGrid.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { GridTile } from '/static/engine/graphics/grid/GridTile.js'; 
import { Palette } from '/static/engine/palette/Palette.js'; 
import { Menu } from '/static/game/memory_cards/Menu.js'; 

export class World {
	constructor() {


	//	new Menu()
		this.gTile = new GrassGrid()
	//	this.grassTile = new GridTile(Palette.fixedOffscreen(4000, 4000), G.image.grassTile)
	}

	update() {
		this.gTile.update()
//		this.grassTile.update()
//		console.log("A")
	}

	draw(draw) {
	}
}
