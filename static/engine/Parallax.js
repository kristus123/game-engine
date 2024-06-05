export function Parallax(object, camera, parallaxFactor=0.99) {
	const x = object.position.x + Cam.position.x * parallaxFactor
	const y = object.position.y + Cam.position.y * parallaxFactor

	return new Position(x, y)
}
