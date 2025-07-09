
export class Collision {
	static between(red, blue) {
		return (
			red !== blue &&
			red.x + red.width >= blue.x &&
			red.x <= blue.x + blue.width &&
			red.y + red.height >= blue.y &&
			red.y <= blue.y + blue.height)
	}

	static deny(red, blue) {
		if (!this.between(red, blue) || red === blue) {
			return
		}

		const overlapX =
      (Math.min(red.x + red.width, blue.x + blue.width) -
      Math.max(red.x, blue.x)) * 5
		const overlapY =
      (Math.min(red.y + red.height, blue.y + blue.height) -
      Math.max(red.y, blue.y)) * 5

		// Push out in the smaller overlap direction
		if (overlapX < overlapY) {
			if (red.x < blue.x) {
				red.x -= overlapX
			}
			else {
				red.x += overlapX
			}
		}
		else {
			if (red.y < blue.y) {
				red.y -= overlapY
			}
			else {
				red.y += overlapY
			}
		}
	}
}
