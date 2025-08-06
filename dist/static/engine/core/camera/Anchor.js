import { a } from '/static/engine/a.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Position } from '/static/engine/core/position/Position.js'; 
import { SmoothPosition } from '/static/engine/core/position/smooth/SmoothPosition.js'; 

function limitNumber(number, min, max) { // not the best method name
	const MIN = min ?? 1
	const MAX = max ?? 20
	return Math.min(Math.max(parseInt(number), MIN), MAX)
}

export class Anchor {
	constructor(anchoredPosition, maxPixelMovement=500, multiplier=1, smoothness=0.1) {

				AssertNotNull(anchoredPosition, "argument anchoredPosition in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(maxPixelMovement, "argument maxPixelMovement in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(multiplier, "argument multiplier in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(smoothness, "argument smoothness in " + this.constructor.name + ".js should not be null")
			
		this.anchoredPosition = anchoredPosition; 
		this.maxPixelMovement = maxPixelMovement; 
		this.multiplier = multiplier; 
		this.smoothness = smoothness; 


		this.smoothPosition = new SmoothPosition(anchoredPosition, smoothness, 100)
	}

	update() {
		this.smoothPosition.update(this.anchoredPosition)

		const x_distanceToMouse = this.smoothPosition.position.x - Camera.position.x
		Camera.position.x += limitNumber(x_distanceToMouse, -this.maxPixelMovement, this.maxPixelMovement) * this.multiplier

		const y_distanceToMouse = this.smoothPosition.position.y - Camera.position.y
		Camera.position.y += limitNumber(y_distanceToMouse, -this.maxPixelMovement, this.maxPixelMovement) * this.multiplier
	}
}
