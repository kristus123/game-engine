import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Collision } from '/static/engine/core/physics/Collision.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class Crate extends DynamicGameObject {
	constructor(position) {
		super(new Position(position.x, position.y, 200, 200), 50, 300, 'https://cdn-icons-png.flaticon.com/512/6618/6618414.png')

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

	}

	update() {

	}

	onCollision(o) {
		ForcePush(this).awayFrom(o, 1.1)
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		draw.new_circle(this.position.center)
	}

}
