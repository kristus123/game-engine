import { InvisibleWall } from '/static/engine/mechanics/invisible_walls/InvisibleWall.js'; 
import { PersistedObjects } from '/static/engine/persistence/PersistedObjects.js'; 

export class InvisibleWalls {
	constructor() {


		this.walls = new PersistedObjects(
			'/persisted-objects/invisible_walls.json',
			json => InvisibleWall.mapFromJsonObject(json))
	}

	update() {
		this.walls.update()
	}

	draw(draw, guiDraw) {
		this.walls.draw(draw, guiDraw)
	}

}
