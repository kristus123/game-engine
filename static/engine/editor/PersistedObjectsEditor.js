export class PersistedObjectsEditor {
	constructor(filePath, create) {
		this.mouseEditor = new MouseEditor()

		this.persistedObjects = new PersistedObjects(filePath)
		this.persistedObjects.objects.forEach(o => {
			this.mouseEditor.add(o)
		})

		Overlay.rightButton(filePath, () => {
			this.mouseEditor.onClick = p => {

				const createdObject = create(p)
				this.mouseEditor.add(createdObject)
				this.persistedObjects.add(createdObject)

				this.mouseEditor.moved = o => {
					this.persistedObjects.persist(o)
				}

				this.mouseEditor.remove = o => {
					this.persistedObjects.remove(o)
					this.mouseEditor.remove(o)
				}
			}
		})
	}

	update() {
		this.mouseEditor.update()
		this.persistedObjects.update()
	}

	draw(draw, guiDraw) {
		this.mouseEditor.draw(draw, guiDraw)
		this.persistedObjects.draw(draw, guiDraw)
	}
}
