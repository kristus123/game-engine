import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Path {
	constructor(points) {

				AssertNotNull(points, "argument points in " + this.constructor.name + ".js should not be null")
			
		this.points = points; 

	}

	update() {
	}

	draw(draw, guiDraw) {
		for (const p of this.points) {
			draw.rectangle(p)
		}
	}
}
