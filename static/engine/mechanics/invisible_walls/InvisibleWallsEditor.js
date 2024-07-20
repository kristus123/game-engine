export class InvisibleWallsEditor {
	constructor() {
		this.localObjects = new LocalObjects([
			new PersistedObjectsEditor(
				'/persisted-objects/invisible_walls.json',
				position => new InvisibleWall(position),
				json => {
					const wall = new InvisibleWall(new Position(json.position.x, json.position.y))
					wall.objectId = json.objectId
					return wall
				},
			),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
