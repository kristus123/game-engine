import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Collision } from '/static/engine/core/physics/Collision.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { D } from '/static/game/world/D.js'; 

export class Bullet extends DynamicGameObject {

	constructor(gun, from, to) {
		super(from, 0, 600)

				AssertNotNull(gun, "argument gun in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(from, "argument from in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(to, "argument to in " + this.constructor.name + ".js should not be null")
			
		this.gun = gun; 
		this.from = from; 
		this.to = to; 


		this.hit = null
		ForcePush(this).towards(to)
	}

	update() {
		for (const o of this.gun.hittableObjects) {
			if (Collision.between(o, this)) {
				o.onHit()
				List.remove(this.gun.hittableObjects, o)
				List.remove(this.gun.bullets, this)
				break
			}
		}
	}

	draw(draw, guiDraw) {
		draw.new_circle(this, 5)
	}
}
