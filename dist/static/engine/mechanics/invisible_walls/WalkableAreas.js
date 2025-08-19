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

	inside(o) {
		return this.positions.some(r =>
			o.x + o.width > r.x &&
			o.x < r.x + r.width &&
			o.y + o.height > r.y &&
			o.y < r.y + r.height)
	}

	outside(o) {
		return !this.inside(o)
	}

	enforce(o) {
		if (this.outside(o)) {
			o.position.x = o.previousPosition.x
			o.position.y = o.previousPosition.y
		}
	}

	getContainingRect(o) {
		return this.positions.find(r =>
			o.x + o.width > r.x &&
			o.x < r.x + r.width &&
			o.y + o.height > r.y &&
			o.y < r.y + r.height) || null
	}

	closestRect(o) {
		if (!this.positions.length) return null

		let closest = this.positions[0]
		let minDist = this._distanceToRect(o, closest)

		for (let i = 1; i < this.positions.length; i++) {
			const dist = this._distanceToRect(o, this.positions[i])
			if (dist < minDist) {
				minDist = dist
				closest = this.positions[i]
			}
		}

		return closest
	}

	_distanceToRect(o, r) {
		const dx = Math.max(r.x - o.x, 0, o.x - (r.x + r.width))
		const dy = Math.max(r.y - o.y, 0, o.y - (r.y + r.height))
		return Math.sqrt(dx * dx + dy * dy)
	}

	draw(draw) {
		this.positions.forEach(r => draw.rectangle(r, Random.color()))
	}
}

