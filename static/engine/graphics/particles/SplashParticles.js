export class SplashParticles {
	constructor(player) {
		this.particles = []
	}

	towards(object) {
		const size = Random.floatBetween(0.1, 10)

		Iterate(20, () => {
			const p = new DynamicGameObject(new Position(object.x, object.y, size, size), 20, 100)
			Push(p).towards(object, 15)

			p.life = 200
			p.color = Random.color()
			this.particles.push(p)
		})
		
	}

	random(object, color='white') {
		const size = Random.floatBetween(1, 10)

		Iterate(20, () => {
			const p = new DynamicGameObject(new Position(object.x, object.y, size, size), 20, 100)
			p.draw = (draw, guiDraw) => {
				draw.rectangle(p, color)
			}

			Push(p).towards(Random.direction(object), 10)

			p.life = 20
			p.color = Random.color()
			this.particles.push(p)
		})
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.particles.forEach((p, index) => {
			// p.x += p.velocity.x
			// p.y += p.velocity.y

			p.life--

			if (p.life <= 0) {
				this.particles.splice(index, 1)
			}
			else {
				p.draw(draw, guiDraw)
			}
		})

	}
}
