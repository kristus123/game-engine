export class InvisibleWalls {
	static {
		this.walls = new PersistedObjects(
			'/persisted-objects/invisible_walls.json',
			json => InvisibleWall.mapFromJsonObject(json))
	}

	static update() {
		this.walls.update()
	}

	static draw(draw, guiDraw) {
		this.walls.draw(draw, guiDraw)
	}

	static touchedBy(o) {
		for (const wall of this.walls) {
			if (wall.touches(o)) {
				return true
			}
		}

		return false
	}
}
