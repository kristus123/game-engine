import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { D } from '/static/game/world/D.js'; 

export class Planet extends DynamicGameObject {
	constructor(position) {
		super(position, 2300, 8)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 1500
		this.position.height = 1500

		this.picture = new Picture(this.position, '/static/assets/planets/exoplanet32x32.png')
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)

		draw.gradient(this.position.offset(750, 750))
	}

}
