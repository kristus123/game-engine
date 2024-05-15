export class Distance {
	static between(o1, o2) {
		const dx = o2.x - o1.x
		const dy = o2.y - o1.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	static withinRadius(o1, o2, radius) {
		return Distance.between(o1, o2) <= radius
	}
}
