export class PersistedStaticPictureEditor {
	constructor(imagePath, storagePath) {
		
		this.localObjects = new LocalObjects([

			new PersistedObjectsEditor(
				storagePath,
				position => new StaticPicture(position.offset(0,0, 180, 100).copy(), imagePath),
				json => {
					const c = new StaticPicture(Position.from(json.position), imagePath)
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
