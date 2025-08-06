import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { KeyDown } from '/static/engine/controller/keyboard/KeyDown.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 

export class Throw {
	constructor(objectToThrow, action= (o) => {}) {

				AssertNotNull(objectToThrow, "argument objectToThrow in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(action, "argument action in " + this.constructor.name + ".js should not be null")
			
		this.objectToThrow = objectToThrow; 
		this.action = action; 

		this.objects = new LocalObjects()

		KeyDown('q', () => {
			const o = objectToThrow()
			this.objects.add(o)

			const p = Mouse.position.copy()

			ForcePush(o).towards(p, 100)

			setTimeout(() => {
				ForcePush(o).towards(p, 40)
			}, 100)

			setTimeout(() => {
				o.velocity.reset()
			}, 600)

			action(o)
		})
	}

	update() {
		this.objects.update()
	}

	draw(draw, guiDraw) {
		this.objects.draw(draw, guiDraw)
	}
}
