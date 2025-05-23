export function Parallax(position, parallaxFactor=0.99) {
	const x = position.x + Camera.position.x * parallaxFactor
	const y = position.y + Camera.position.y * parallaxFactor

	return new Position(x, y)
}
