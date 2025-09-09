import { Iterate } from '/static/engine/Iterate.js'; 
import { Random } from '/static/engine/Random.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Splash {
	constructor() {


		this.particles = []
	}

	towards(object) {
		const size = Random.floatBetween(0.1, 10)

		Iterate(20, () => {
			const p = new DynamicGameObject(new Position(object.x, object.y, size, size), 20, 100)
			p.pushTowards(object, 15)

			p.life = 200
			p.color = Random.color()
			this.particles.push(p)
		})

	}

	random(object, color='white') {

		Iterate(60, () => {
			const size = Random.floatBetween(0.1, 10)

			const p = new DynamicGameObject(new Position(object.x, object.y, size, size), 20, 100)
			p.draw = (draw) => {
				draw.rectangle(p, color)
			}

			p.pushTowards(Random.direction(object), Random.integerBetween(1, 5))

			p.life = 20
			p.color = Random.color()
			this.particles.push(p)
		})
	}

	update() {
	}

	draw(draw) {
		this.particles.forEach((p, index) => {
			// p.x += p.velocity.x
			// p.y += p.velocity.y

			p.life--

			if (p.life <= 0) {
				this.particles.splice(index, 1)
			}
			else {
				p.draw(draw)
			}
		})

	}
}
