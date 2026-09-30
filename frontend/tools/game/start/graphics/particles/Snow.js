export class Snow {
	constructor(importantPosition) {
		this.particles = []

		this.flake()
	}

	flake() {
		const size = Random.floatBetween(1, 2) * 5

		const x = Random.direction(this.importantPosition.copy(50, 50), 800)
		x.width = size
		x.height = size


		const p = Entity(x)
		p.pushTo(p.position.copy(Random.integerBetween(100, 200), Random.integerBetween(200, 10_000)), 19_000)

		p.life = 300
		p.color = "white"
		this.particles.push(p)

	}

	update() {
		if (Random.percentageChance(1.0)) {
			this.flake()
			this.flake()
			this.flake()
			this.flake()
			this.flake()
		}

		for (const p of this.particles) {

			// p.life--

			if (p.life <= 0) {
				this.particles.remove(p)
			}
			else {
				p.update()
				D1.rectangle(p, p.color)
			}
		}
	}

}
