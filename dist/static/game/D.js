
export function D(d) {
	const object = {}

	object.draw = (draw, guiDraw) => d(draw, guiDraw, object)

	return object
}
