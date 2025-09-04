import { G } from '/static/engine/G.js'; 
import { GrassGrid } from '/static/engine/graphics/grid/GrassGrid.js'; 
import { Grid } from '/static/engine/graphics/grid/Grid.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class World {
	constructor() {


		this.localObjects = new LocalObjects([
			// G.Sprite.world(new Position(0, 0)).idle.show(0),
			new GrassGrid(),
		])

	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
