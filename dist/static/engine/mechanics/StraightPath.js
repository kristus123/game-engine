import { Init } from '/static/engine/Init.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Registry } from '/static/engine/objects/Registry.js'; 

export class StraightPath {
	constructor(start, end) {

				AssertNotNull(start, "argument start in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(end, "argument end in " + this.constructor.name + ".js should not be null")
			
		this.start = start; 
		this.end = end; 


		this.localObjects = new LocalObjects([
			Init(this, {
				line: new Square(start.position.copy(), 20)
			})
		])

		this.blocked = true

		this.finishedChecking = false
	}

	get clear() {
		return !this.blocked
	}

	update() {
		ForcePush(this.line).towards(this.end, 300)

		if (this.line.touchesAny(Registry.invisibleWalls)) {
			this.blocked = true

			this.line.x = this.start.x
			this.line.y = this.start.y
		}

		if (this.line.touches(this.end)) {
			this.blocked = false

			this.line.x = this.start.x
			this.line.y = this.start.y
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.line(this.line, this.end)
	}
}
