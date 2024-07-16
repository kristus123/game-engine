export function Parallax(position, parallaxFactor=0.99) {
	const x = position.x + Cam.position.x * parallaxFactor
	const y = position.y + Cam.position.y * parallaxFactor

	return new Position(x, y)
}
