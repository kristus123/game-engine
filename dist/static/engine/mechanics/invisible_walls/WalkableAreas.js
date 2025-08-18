import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class WalkableAreas {
	constructor(positions = [], buffer = 1) {

				AssertNotNull(positions, "argument positions in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(buffer, "argument buffer in " + this.constructor.name + ".js should not be null")
			
		this.positions = positions; 
		this.buffer = buffer; 

	}

	add(p) {
		this.positions.push(p)
	}

	enforce(o) {
		const insideAny = this.positions.some(p =>
			o.x + o.width > p.x - this.buffer &&
			o.x < p.x + p.width + this.buffer &&
			o.y + o.height > p.y - this.buffer &&
			o.y < p.y + p.height + this.buffer
		)

		if (!insideAny) {
			o.x = o.previousPosition.x
			o.y = o.previousPosition.y
			o.velocity.x = 0
			o.velocity.y = 0
		}
	}

	draw(draw, guiDraw) {
		this.positions.forEach(area => area.draw(draw, guiDraw))
	}
}

