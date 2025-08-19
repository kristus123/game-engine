export class WalkableAreas {
	constructor(buffer = 0) {
		this.buffer = buffer
		this.positions = []
	}

	add(p) {
		this.positions.push(p)
	}

	inside(o) {
		return this.positions.some(r =>
			o.position.x + o.width > r.x &&
			o.position.x < r.x + r.width &&
			o.position.y + o.height > r.y &&
			o.position.y < r.y + r.height)
	}

	enforce(o) {
		if (!this.inside(o)) {
			o.position.x = o.previousPosition.x
			o.position.y = o.previousPosition.y
		}
	}

	draw(draw) {
		this.positions.forEach(r => draw.rectangle(r, Random.color()))
	}
}

