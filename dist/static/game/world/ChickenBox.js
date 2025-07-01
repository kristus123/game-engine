import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { StaticGameObject } from '/static/engine/objects/StaticGameObject.js'; 

export class ChickenBox extends StaticGameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 50
		this.position.height = 50

		this.localObjects = new LocalObjects([
			new Picture(position, '/static/assets/box.png')
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
