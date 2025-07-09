import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 

export class Compass {
	constructor(targets=[]) {

				AssertNotNull(targets, "argument targets in " + this.constructor.name + ".js should not be null")
			
		this.targets = targets; 

	}

	one(position, color='red') {
		this.clear()
		this.add(position, color)

	}

	add(position, color='red') {
		this.targets.push({ position, color })
	}

	remove(position, color) {
		List.removeIf(this.targets, t => t.position === position)
	}

	clear() {
		this.targets = []
	}

	draw(draw, guiDraw) {
		for (const t of this.targets) {
			draw.objectThatIsMovingInRectangularPathAroundObject(t.position, t.color)
		}
	}
}
