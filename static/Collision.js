class Collision {
	static between(red, blue) {
		return (
			red !== blue &&
			red.x + red.width >= blue.x &&
			red.x <= blue.x + blue.width &&
			red.y + red.height >= blue.y &&
			red.y <= blue.y + blue.height
		)
	}
}
