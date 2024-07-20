export class InvisibleWallsEditor {
	constructor() {
		this.localObjects = new LocalObjects([
			new PersistedObjectsEditor(
				'/persisted-objects/invisible_walls.json',
				position => new InvisibleWall(position),
				json => InvisibleWall.mapFromJsonObject(json),
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
