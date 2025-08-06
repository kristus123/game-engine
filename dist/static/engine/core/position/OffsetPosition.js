import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { AnalShit } from '/static/engine/core/position/AnalShit.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 

export class OffsetPosition {
	constructor(position, offset_x=0, offset_y=0, width=position.width, height=position.height) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(offset_x, "argument offset_x in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(offset_y, "argument offset_y in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(width, "argument width in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(height, "argument height in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.offset_x = offset_x; 
		this.offset_y = offset_y; 
		this.width = width; 
		this.height = height; 

	}

	get x() {
		return this.position.x + this.offset_x
	}

	get y() {
		return this.position.y + this.offset_y
	}

	copy() {
		return new Position(this.position.x + this.offset_x, this.position.y + this.offset_y, this.width, this.height)
	}

	behind(anotherPosition, distance) {
		return AnalShit.positionBehind(this, anotherPosition, distance)
	}

}
