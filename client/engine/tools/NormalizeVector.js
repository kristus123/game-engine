export function NormalizeVector(vector) {

	const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y)

	if (mag == 0) {
		return {
			x: 0,
			y: 0,
		}
	}
	else {
		return {
			x: vector.x / mag,
			y: vector.y / mag,
		}
	}
}
