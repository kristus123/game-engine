import { a } from '/static/engine/code_tools/a.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export function Parallax(position, parallaxFactor=0.99) {
	const x = position.x + Camera.position.x * parallaxFactor
	const y = position.y + Camera.position.y * parallaxFactor

	return new Position(x, y)
}
