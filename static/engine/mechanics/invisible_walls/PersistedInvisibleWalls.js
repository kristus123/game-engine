export class PersistedInvisibleWalls {
	constructor(player) {
		this.walls = new PersistedObjects('/persisted-objects/invisible_walls.json', json => {
			const wall = new InvisibleWall(new Position(json.position.x, json.position.y))
			wall.objectId = json.objectId
			return wall
		})

		this.add(player)
	}

	add(o) {
		for (const w of this.walls.objects) {
			w.add(o)
		}
	}

	update() {
		this.walls.update()
	}

	draw(draw, guiDraw) {
		this.walls.draw(draw, guiDraw)
	}
}
