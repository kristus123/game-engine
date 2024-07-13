export class PersistedObjectsEditor {

	constructor(filePath, create, mapFromJson) {
		this.persistedObjects = new PersistedObjects(filePath, mapFromJson)

		this.mouseEditor = new MouseEditor()
		this.persistedObjects.objects.forEach(o => {
			this.mouseEditor.add(o)
		})

		this.mouseEditor.onClick = p => {
			const createdObject = create(p)
			this.mouseEditor.add(createdObject)
			this.persistedObjects.add(createdObject)
		}

		this.mouseEditor.moved = o => {
			this.persistedObjects.persist(o)
		}

		this.mouseEditor.remove = o => {
			this.persistedObjects.remove(o)
		}

		Overlay.rightButton(filePath, () => {
			MouseEditor.active = this.mouseEditor
		})
	}

	update() {
		this.persistedObjects.update()
	}

	draw(draw, guiDraw) {
		this.persistedObjects.draw(draw, guiDraw)
	}
}
