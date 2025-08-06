import { Picture } from '/static/engine/Picture.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class Tree extends StaticGameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 200
		this.position.height = 200

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/tree.png')
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
