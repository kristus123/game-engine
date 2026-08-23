export class Splash {
	constructor() {
		this.particles = []
	}

	towards(object) {
		const size = Random.floatBetween(0.1, 10)

		Iterate(20, () => {
			const p = Entity(WorldPosition(object.x, object.y, size, size), 20, 100)
			p.pushTowards(object, 15)

			p.life = 200
			p.color = Random.color()
			this.particles.push(p)
		})
		return this

	}

	random(object, color="white") {

		Iterate(10, () => {
			const size = Random.floatBetween(0.1, 10)

			const p = Entity(WorldPosition(object.x, object.y, size, size), 20, 100)

			p.pushTowards(Random.direction(object), Random.integerBetween(1, 5))

			p.life = 200
			p.color = Random.color()
			this.particles.push(p)
		})
	}

	update() {
		this.particles.forEach((p, index) => {
			// p.x += p.velocity.x
			// p.y += p.velocity.y

			p.life--

			if (p.life <= 0) {
				this.particles.splice(index, 1)
			}
			else {
				D1.rectangle(p, p.color)
			}
		})
	}

}
