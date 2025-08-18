import { Random } from '/static/engine/Random.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class WalkableAreas {
	constructor(buffer = 0) {

				AssertNotNull(buffer, "argument buffer in " + this.constructor.name + ".js should not be null")
			
		this.buffer = buffer; 

		this.buffer = buffer
		this.positions = []
	}

	add(p) {
		this.positions.push(p)
	}

	enforce(o) {
		const insideAny = this.positions.some(r =>
			o.position.x + o.width > r.x &&
			o.position.x < r.x + r.width &&
			o.position.y + o.height > r.y &&
			o.position.y < r.y + r.height
		)

		if (!insideAny) {
			o.position.x = o.previousPosition.x
			o.position.y = o.previousPosition.y
			o.velocity.x = 0
			o.velocity.y = 0
		}
	}

	draw(draw) {
		this.positions.forEach(r => draw.rectangle(r, Random.color()))
	}
}

