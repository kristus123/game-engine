export class AnalShit {

	static positionBehind(origin, target, distance) {
		const direction_x = target.x - origin.x
		const direction_y = target.y - origin.y

		const length = Math.sqrt(direction_x * direction_x + direction_y * direction_y)

		const extendedVectorX = direction_x / length * distance
		const extendedVectorY = direction_y / length * distance

		const new_x = target.x + extendedVectorX
		const new_y = target.y + extendedVectorY

		return new Position(new_x, new_y)
	}

}
