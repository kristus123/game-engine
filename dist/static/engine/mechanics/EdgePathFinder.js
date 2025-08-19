import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class EdgePathFinder {
	constructor(padding = 10) {

				AssertNotNull(padding, "argument padding in " + this.constructor.name + ".js should not be null")
			
		this.padding = padding; 

		this.square = null
		this.clearPath = false
		this.padding = padding
	}

	update(source, target) {
		if (!this.square) {
			this.square = new Square(new Position(source.x, source.y), 10)
		}

		const edgeTarget = this._clampedTarget(target)
		ForcePush(this.square).towards(edgeTarget, 50)

		if (this.square.touches(edgeTarget)) {
			this.square = null
			this.clearPath = true
		}
		else if (G.invisibleWalls.collides(this.square)) {
			this.square = null
			this.clearPath = false
		}
		else if (G.walkableAreas.outside(this.square)) {
			this.square = null
			this.clearPath = false
		}
	}

	_clampedTarget(target) {
		const area = G.walkableAreas.getContainingRect(target) || G.walkableAreas.closestRect(target)
		if (!area) return new Position(target.x, target.y)

		const x = Math.min(Math.max(target.x, area.x + this.padding), area.x + area.width - this.padding)
		const y = Math.min(Math.max(target.y, area.y + this.padding), area.y + area.height - this.padding)

		return new Position(x, y)
	}

	draw(draw, guiDraw) {
		if (this.square) {
			this.square.draw(draw, guiDraw)
		}
	}
}

