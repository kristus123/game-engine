import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { MouseEditor } from '/static/engine/controller/mouse/MouseEditor.js'; 
import { Button } from '/static/engine/graphics/ui/Button.js'; 
import { Overlay } from '/static/engine/graphics/ui/Overlay.js'; 
import { PersistedObjects } from '/static/engine/persistence/PersistedObjects.js'; 

export class PersistedObjectsEditor {

	constructor(filePath, create, mapFromJson) {

				AssertNotNull(filePath, "argument filePath in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(create, "argument create in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(mapFromJson, "argument mapFromJson in " + this.constructor.name + ".js should not be null")
			
		this.filePath = filePath; 
		this.create = create; 
		this.mapFromJson = mapFromJson; 

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
