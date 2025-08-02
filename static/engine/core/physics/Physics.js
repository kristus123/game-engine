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

			const frictionFactor = 1 - o.weight / 5_000 // Adjust this factor as needed

			o.velocity.x *= Math.pow(frictionFactor, deltaTime)
			o.velocity.y *= Math.pow(frictionFactor, deltaTime)

			o.x += o.velocity.x * deltaTime
			o.y += o.velocity.y * deltaTime

			if (Math.abs(o.velocity.x) < 1) {
				o.velocity.x = 0
			}
			if (Math.abs(o.velocity.y) < 1) {
				o.velocity.y = 0
			}
		}
	}

}
