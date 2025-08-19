import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Path {
	constructor(npc, points) {

				AssertNotNull(npc, "argument npc in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(points, "argument points in " + this.constructor.name + ".js should not be null")
			
		this.npc = npc; 
		this.points = points; 

		this.index = 0
	}

	get position() {
		if (!this.completed) {
			return this.points[this.index]
		}
		else {
			return new Position(0, 0)
		}
	}

	update() {
		const currentTarget = this.points[this.index]
		this.currentTarget = currentTarget
		if (currentTarget) {
			if (this.npc.touches(currentTarget)) {
				if (this.index < this.points.length - 1) {
					this.index++
				}
			}
		}
	}

	get completed() {
		return this.index >= this.points.length - 1 &&
		       this.npc.touches(this.points[this.points.length - 1])
	}

	draw(draw, guiDraw) {
		for (const p of this.points) {
			draw.box(p)
		}

		for (let i = 0; i < this.points.length; i++) {
			const p = this.points[i]
			draw.rectangle(p)

			if (i < this.points.length - 1) {
				const next = this.points[i + 1]
				draw.line(p, next)
			}
		}
	}
}

