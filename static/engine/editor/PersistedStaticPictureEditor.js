export class PersistedPictureEditor {
	constructor(imagePath, storagePath, width=180, height=100) {

		this.localObjects = new LocalObjects([

			new PersistedObjectsEditor(
				storagePath,
				position => new Picture(position.offset(0, 0, width, height).copy(), imagePath),
				json => {
					const c = new Picture(Position.from(json.position), imagePath)
					c.objectId = json.objectId
					return c
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
