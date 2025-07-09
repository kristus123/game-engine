import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class BeaconShit extends DynamicGameObject {
	constructor(position) {
		super(new Position(position.x, position.y, 20, 20), 100, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.radius = 0
	}

	update() {
		this.radius += 10
		if (this.radius >= 1500) {
			this.radius = 0
		}
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		draw.hollowCircle(this.position, 'red', this.radius)
	}
}
