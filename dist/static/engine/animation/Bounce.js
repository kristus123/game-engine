import { Loop } from '/static/engine/Loop.js'; 
import { Motion } from '/static/engine/animation/Motion.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class Bounce {
	constructor(object) {

				AssertNotNull(object, "argument object in " + this.constructor.name + ".js should not be null")
			
		this.object = object; 

		this.localObjects = new LocalObjects([
			this.motion = new Motion(),
		])

		this.motion.start()
	}

	update() {
		console.log(this.motion.value)
		this.object.position.scale(this.motion.value)

		// if (!this.motion.playing) {
		// 	this.removeFromLoop()
		// }
	}

	draw(draw, guiDraw) {
	}
}
