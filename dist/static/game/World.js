import { G } from '/static/engine/G.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { GridMap } from '/static/engine/graphics/grid/GridMap.js'; 
import { TileList } from '/static/engine/graphics/grid/TileList.js'; 
import { Menu } from '/static/game/memory_cards/Menu.js'; 

export class World {
	constructor() {


	//	new Menu()
		this.map = new GridMap()
		this.map.set_current_tile(TileList.GRASS_TILE);
	}

	update() {
		this.map.update()
		console.log("A")
	}

	draw(draw) {
	}
}
