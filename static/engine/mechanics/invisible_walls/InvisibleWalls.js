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
