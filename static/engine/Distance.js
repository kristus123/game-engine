export class Distance {
	static calculateDistance(point1, point2) {
		const dx = point2.x - point1.x
		const dy = point2.y - point1.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	// bug : only works if correct order. make it work in both orders
	static withinRadius(o1, o2, radius) {
		const distance = Math.sqrt(
			(o2.x + o2.width / 2 - o1.x) ** 2 +
				(o2.y + o2.height / 2 - o1.y) ** 2,
		)
		return distance <= radius
	}
}
