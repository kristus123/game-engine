export class Physics {

	static objects = []

	static apply(o) {
		this.objects.push(o)
		return o
	}

	static removePhysics(o) {
		this.objects.remove(o)
	}

	static update(deltaTime) {
		for (let o of this.objects) {
			o.previousPosition = { x: o.x, y: o.y }

			const frictionPerSecond = 0.9 // loses 10% per second
			const decay = Math.pow(frictionPerSecond, deltaTime)

			o.velocity.x *= decay.round()
			o.velocity.y *= decay.round()

			o.x += (o.velocity.x * deltaTime).round()
			o.y += (o.velocity.y * deltaTime).round()

			if (Math.abs(o.velocity.x) < 0.01) {
				o.velocity.x = 0
			}
			if (Math.abs(o.velocity.y) < 0.01) {
				o.velocity.y = 0
			}
		}
	}

}
