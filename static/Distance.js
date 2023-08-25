export class Distance {

	// bug : only works if correct order. make it work in both orders
	static withinRadius(o1, o2, radius) {
		const distance = Math.sqrt((o2.x + o2.width / 2 - o1.x)**2 + (o2.y + o2.height / 2 - o1.y)**2)
		return distance <= radius;
	}
	
}
