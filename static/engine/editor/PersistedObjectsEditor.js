let active = null

export class PersistedObjectsEditor {

	constructor(filePath, create) {
		this.persistedObjects = new PersistedObjects(filePath)

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
			console.log('active:')
			console.log(filePath)
			active = this
			MouseEditor.active = this.mouseEditor
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
