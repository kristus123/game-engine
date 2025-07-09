import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { _GameObject } from '/static/engine/objects/_GameObject.js'; 

export class StaticGameObject extends _GameObject {
	constructor(position) {
		super(position)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

	}
}
