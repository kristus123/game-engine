import { Position } from '/static/engine/core/position/Position.js'; 

export function ParallaxTest(position, parallaxFactor=0.99) {
	const x = position.x * parallaxFactor
	const y = position.y * parallaxFactor

	return new Position(x, y)
}
