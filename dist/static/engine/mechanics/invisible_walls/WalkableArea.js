import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class WalkableAreas {
    constructor(positions = []) {

				AssertNotNull(positions, "argument positions in " + this.constructor.name + ".js should not be null")
			
		this.positions = positions; 

    }

    enforce(object) {
        const insideAny = this.positions.some(area => 
            object.position.x + object.position.width > area.position.x &&
            object.position.x < area.position.x + area.position.width &&
            object.position.y + object.position.height > area.position.y &&
            object.position.y < area.position.y + area.position.height
        )

        if (!insideAny) {
            object.position.x = object.previousPosition.x
            object.position.y = object.previousPosition.y
            object.velocity.x = 0
            object.velocity.y = 0
        }
    }

    draw(draw, guiDraw) {
        this.positions.forEach(area => area.draw(draw, guiDraw))
    }
}

