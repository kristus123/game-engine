export class Splash extends DynamicGameObject {
	constructor(position = new Position(0, 0, 1, 1), options = {}) {
		super(position, options)
		this.particles = []
	}

	towards(object) {
		const size = Random.floatBetween(0.1, 10)

		Iterate(20, () => {
			const p = new DynamicGameObject(
				new Position(object.x, object.y, size, size),
				{ speed: 20, movementThreshold: 100 }
			)

			// Movement in direction to a object
			p.moveTowards(object, 15)

			p.life = 200
			p.color = Random.color()
			this.particles.push(p)
		})
	}

	random(object, color = 'white') {
		Iterate(60, () => {
			const size = Random.floatBetween(0.1, 10)

			const p = new DynamicGameObject(
				new Position(object.x, object.y, size, size),
				{ speed: 20, movementThreshold: 100 }
			)

			p.draw = (draw) => {
				draw.rectangle(p, color)
			}

			// Random direction movement
			p.moveTowards(Random.direction(object), Random.integerBetween(1, 5))

			p.life = 20
			p.color = Random.color()
			this.particles.push(p)
		})
	}

	update() {
		this.particles.forEach((p, index) => {
			p.life--

			if (p.life <= 0) {
				this.particles.splice(index, 1)
			}
		})
	}

	draw(draw) {
		this.particles.forEach((p) => {
			if (p.life > 0) {
				p.draw(draw)
			}
		})
	}
}
