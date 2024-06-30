export class PersistedObjectsEditor {
	constructor(filePaths) {
		this.mouseEditor = new MouseEditor()

		this.localObjects = new LocalObjects([
			this.mouseEditor,
		])

		this.persistedObjects = []

		for (const {filePath, create} of filePaths) {

			const objects = new PersistedObjects(filePath)
			this.persistedObjects.push(objects)

			objects.objects.forEach(o => {
				this.mouseEditor.add(o)
			})

			Overlay.rightButton(filePath, () => {
				this.mouseEditor.onClick = p => {
					const c = create(p)
					this.mouseEditor.add(c)
					objects.add(c)

					this.mouseEditor.moved = o => {
						objects.persist(o)
					}

					this.mouseEditor.remove = o => {
						objects.remove(o)
						this.mouseEditor.remove(o)
					}
				}
			})
		}
	}

	update() {
		this.localObjects.update()

		for (const o of this.persistedObjects) {
			o.update()
		}
		
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		for (const o of this.persistedObjects) {
			o.draw(draw, guiDraw)
		}
	}
}
