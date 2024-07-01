let active = null

export class PersistedObjectsEditor {

	static active = null

	constructor(filePath, create) {

		this.mouseEditor = new MouseEditor()
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

		this.persistedObjects = new PersistedObjects(filePath)
		this.persistedObjects.objects.forEach(o => {
			this.mouseEditor.add(o)
		})

		Overlay.rightButton(filePath, () => {
			active = this
		})
	}

	update() {
		this.persistedObjects.update()

		if (active == this) {
			this.mouseEditor.update()
		}
	}

	draw(draw, guiDraw) {
		this.persistedObjects.draw(draw, guiDraw)

		if (active == this) {
			this.mouseEditor.draw(draw, guiDraw)
		}
	}
}
