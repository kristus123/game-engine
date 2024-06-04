export function Parallax(object, parallaxFactor=0.99) {
	const x = object.position.x + Camera.position.x * parallaxFactor
	const y = object.position.y + Camera.position.y * parallaxFactor

	return new Position(x, y)
}
