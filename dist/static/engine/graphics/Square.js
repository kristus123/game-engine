import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 

export class Square extends DynamicGameObject {
	constructor(position, size, run=() => {}) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(size, "argument size in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(run, "argument run in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.size = size; 
		this.run = run; 

		this.position.width = size
		this.position.height = size

		run(this)
	}

	update() {

	}

	draw(draw, guiDraw) {
		draw.rectangle(this.position, this.color || 'white')
	}
}
