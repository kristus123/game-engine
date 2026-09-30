export class Snow {
	constructor(importantPosition) {
		this.particles = []

		this.flake()
	}

	flake() {
		const size = Random.floatBetween(10, 20)

		const x = Random.direction(this.importantPosition.copy(50, 50), 800)
		x.width = size
		x.height = size


		const p = Entity(x)
		p.pushTo(p.position.copy(Random.integerBetween(100, 200), Random.integerBetween(200, 800)), 12_000)

		p.life = 300
		p.color = "white"
		this.particles.push(p)
		
	}

	update() {
		if (Random.percentageChance(0.1)) {
			this.flake()
		}

		for (const p of this.particles) {

			p.life--

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
