import { Collision } from '/static/Collision.js';

export class Physics {
	constructor() {
		this.objects = []
	}

	applyTo(o) {
		this.objects.push(o)
		return o
	}

	update(deltaTime) {
		for (let o of this.objects) {
			if (typeof deltaTime === 'number') {
				for (let anotherO of this.objects) {
					if (Collision.between(o, anotherO)) {
						console.log("COLLISSION !!!")
					}
				}

				o.x += o.velocity.x * deltaTime
				o.y += o.velocity.y * deltaTime
			}
		}
	}
}
