export function ParallaxTest(position, parallaxFactor=0.99) {
	const x = position.x * parallaxFactor
	const y = position.y * parallaxFactor

	return Position(x, y)
}
