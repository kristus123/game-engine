import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { PersistedObjectsEditor } from '/static/engine/editor/PersistedObjectsEditor.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { PersistedObjects } from '/static/engine/persistence/PersistedObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class PersistedPictureEditor {
	constructor(imagePath, storagePath, width=180, height=100) {

				AssertNotNull(imagePath, "argument imagePath in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(storagePath, "argument storagePath in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(width, "argument width in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(height, "argument height in " + this.constructor.name + ".js should not be null")
			
		this.imagePath = imagePath; 
		this.storagePath = storagePath; 
		this.width = width; 
		this.height = height; 


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
