import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { SmoothValue } from '/static/engine/code_tools/smooth/SmoothValue.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Init } from '/static/game/world/Init.js'; 

export class SmoothPosition {
	constructor(targetPosition, smoothness=0.01, threshold=0.0001) {

				AssertNotNull(targetPosition, "argument targetPosition in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(smoothness, "argument smoothness in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(threshold, "argument threshold in " + this.constructor.name + ".js should not be null")
			
		this.targetPosition = targetPosition; 
		this.smoothness = smoothness; 
		this.threshold = threshold; 

		this.position = new Position(0, 0)

		this.localObjects = new LocalObjects([
			Init(this, {
				smooth_x: new SmoothValue(this.position.x, targetPosition.x, smoothness, threshold),
				smooth_y: new SmoothValue(this.position.y, targetPosition.y, smoothness, threshold),
			})
		])
	}

	update(targetPosition) {
		this.position.x = this.smooth_x.currentValue
		this.position.y = this.smooth_y.currentValue

		this.smooth_x.targetValue = targetPosition.x
		this.smooth_y.targetValue = targetPosition.y

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.circle(this.position)
	}
}
