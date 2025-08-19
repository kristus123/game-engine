export class InvisibleWalls {
	constructor(positions) {

		for (const p of positions) {
			if (p.width == 1) {
				p.width = 100
				p.height = 100
			}
		}
	}

	collides(o) {
		for (const p of this.positions) {
			if (Collision.between(o, p)) {
				return true
			}
		}

		return false
	}

	enforce(object) {
		for (const p of this.positions) {
			if (Collision.between(p, object)) {
				const currentPosition = { x: object.position.x, y: object.position.y }

				object.position.x = object.previousPosition.x
				if (!Collision.between(p, object)) {

					object.velocity.x = 0
					object.position.x = object.previousPosition.x
					return
				}
				else {
					object.position.x = currentPosition.x
				}

				object.position.y = object.previousPosition.y
				if (!Collision.between(p, object)) {

					object.velocity.y = 0
					object.position.y = object.previousPosition.y
					return
				}
				else {
					object.position.y = currentPosition.y
				}
			}
			
		}
	}

	draw(draw, guiDraw) {
		for (const p of this.positions) {
			draw.transparentRedRectangle(p)
		}
	}

}
