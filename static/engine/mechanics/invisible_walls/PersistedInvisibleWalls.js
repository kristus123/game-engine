export class PersistedInvisibleWalls {
	constructor(player) {
		this.walls = new PersistedObjects(
			'/persisted-objects/invisible_walls.json',
			json => InvisibleWall.mapFromJsonObject(json))

		this.add(player)
	}

	add(o) {
		for (const invisibleWall of this.walls.objects) {
			invisibleWall.add(o)
		}
	}

	update() {
		this.walls.update()
	}

	draw(draw, guiDraw) {
		this.walls.draw(draw, guiDraw)
	}
}
