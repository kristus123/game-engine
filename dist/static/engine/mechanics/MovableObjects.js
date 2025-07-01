import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Key } from '/static/engine/controller/keyboard/Key.js'; 
import { KeyDown } from '/static/engine/controller/keyboard/KeyDown.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 

export class MovableObjects {
	constructor(movableBy, objects=[]) {

				AssertNotNull(movableBy, "argument movableBy in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(objects, "argument objects in " + this.constructor.name + ".js should not be null")
			
		this.movableBy = movableBy; 
		this.objects = objects; 


		this.e = new Key('e')

		this.holding = null

		KeyDown('q', () => {
			ForcePush(this.holding).towards(Mouse.position, 100)
			this.holding = null
		})
	}

	add(o) {
		this.objects.push(o)
	}

	update() {
		if (this.holding) {
			this.holding.x = this.movableBy.x
			this.holding.y = this.movableBy.y
		}
		else {
			for (const o of this.objects) {
				if (Distance.within(100, o, this.movableBy) && this.e.down) {
					this.holding = o
				}
			}
		}
	}

	draw(draw, guiDraw) {
		if (this.holding) {
			draw.text(this.holding.position.offset(0, -50), 'Press Q to throw')
		}
		else {
			for (const o of this.objects) {
				if (Distance.within(100, o, this.movableBy)) {
					draw.text(o.position.offset(0, -50), 'Press E to pick up')
					break
				}
			}
		}
	}
}
