export class WalkableAreas {
	constructor(positions = [], buffer = 1) {
	}

	add(p) {
		this.positions.push(p)
	}

	enforce(o) {
		const insideAny = this.positions.some(p =>
			o.x + o.width > p.x - this.buffer &&
			o.x < p.x + p.width + this.buffer &&
			o.y + o.height > p.y - this.buffer &&
			o.y < p.y + p.height + this.buffer
		)

		if (!insideAny) {
			o.x = o.previousPosition.x
			o.y = o.previousPosition.y
			o.velocity.x = 0
			o.velocity.y = 0
		}
	}

	draw(draw, guiDraw) {
		this.positions.forEach(area => area.draw(draw, guiDraw))
	}
}

