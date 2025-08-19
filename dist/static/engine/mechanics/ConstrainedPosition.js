import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class ConstrainedPosition {
	constructor(position, contrainedPositions) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(contrainedPositions, "argument contrainedPositions in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.contrainedPositions = contrainedPositions; 

	}
}


getConstrainedPosition(x, y, padding = 0) {
    for (const pos of this.constrainedPositions) {
        if (
            x >= pos.x + padding &&
            x <= pos.x + pos.width - padding &&
            y >= pos.y + padding &&
            y <= pos.y + pos.height - padding
        ) {
            return new Position(x, y);
        }
    }
    return null;
}

