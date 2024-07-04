export class PersistedObjectsEditor {

	static active = null

	constructor(filePath, create, mapFromJson) {
		this.persistedObjects = new PersistedObjects(filePath, mapFromJson)

		this.mouseEditor = new MouseEditor()
		this.mouseEditor.onClick = p => {
			const createdObject = create(p)
			this.mouseEditor.add(createdObject)
			this.persistedObjects.add(createdObject)
		}

		this.mouseEditor.moved = o => {
			console.log("moved")
			this.persistedObjects.persist(o)
		}

		this.mouseEditor.remove = o => {
			this.persistedObjects.remove(o)
		}

		this.persistedObjects.objects.forEach(o => {
			this.mouseEditor.add(o)
		})

		Overlay.rightButton(filePath, () => {
			PersistedObjectsEditor.active = this
			MouseEditor.active = this.mouseEditor
		})
	}

	update() {
		this.persistedObjects.update()

		if (PersistedObjectsEditor.active == this) {
			this.mouseEditor.update()
		}
	}

	draw(draw, guiDraw) {
		this.persistedObjects.draw(draw, guiDraw)

		if (PersistedObjectsEditor.active == this) {
			this.mouseEditor.draw(draw, guiDraw)
		}
	}
}
