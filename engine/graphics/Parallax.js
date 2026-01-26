// I think this one is used for static background when moving around the world
export function Parallax(position, parallaxFactor=0.99) {
	const x = position.x + Camera.position.x * parallaxFactor
	const y = position.y + Camera.position.y * parallaxFactor

	return Position(x, y)
}
