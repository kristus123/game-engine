export class Splash {
	constructor() {
		this.particles = []
	}

	towards(object) {
		const size = Random.floatBetween(0.1, 10)

		Iterate(20, () => {
			const p = Entity(WorldPosition(object.x, object.y, size, size))
			p.pushTo(object, 15)

			p.life = 200
			p.color = Random.color()
			this.particles.push(p)
		})
	}

	random(object, color="white") {

		Iterate(10, () => {
			const size = Random.floatBetween(0.1, 10)

			const p = Entity(WorldPosition(object.x, object.y, size, size))

			p.pushTo(Random.direction(object), 200)

			p.life = 200
			p.color = Random.color()
			this.particles.push(p)
		})
	}

	update() {
		for (const p of this.particles) {

			p.life--

			if (p.life <= 0) {
				this.particles.remove(p)
			}
			else {
				console.log(p)
				p.update()
				D1.rectangle(p, p.color)
			}
		}
	}

}
