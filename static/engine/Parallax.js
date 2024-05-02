export function Parallax(object, camera, parallaxFactor=0.99) {
	const x = object.position.x + camera.position.x * parallaxFactor
	const y = object.position.y + camera.position.y * parallaxFactor

	return new Position(x, y)
}
