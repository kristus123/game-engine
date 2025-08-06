export class Physics {
	constructor() {
		this.objects = []
	}

	static global = new Physics()

	applyPhysics(o) {
		this.objects.push(o)
		return o
	}

	removePhysics(o) {
		List.remove(this.objects, o)
	}

	update(deltaTime) {
		for (let o of this.objects) {
			o.previousPosition = { x: o.x, y: o.y }

			const frictionPerSecond = 0.9 // lose 10% per second
			const decay = Math.pow(frictionPerSecond, deltaTime)

			o.velocity.x *= decay
			o.velocity.y *= decay

			o.x += o.velocity.x * deltaTime
			o.y += o.velocity.y * deltaTime

			if (Math.abs(o.velocity.x) < 0.01) {
				o.velocity.x = 0
			}
			if (Math.abs(o.velocity.y) < 0.01) {
				o.velocity.y = 0
			}
		}
	}

}
