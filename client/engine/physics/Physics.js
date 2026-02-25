export class Physics {
	static objects = []

	static apply(o) {
		this.objects.push(o)
		return o
	}

	static removePhysics(o) {
		this.objects.remove(o)
	}

	static update() {
		for (let o of this.objects) {
			o.previousPosition = { x: o.position.x, y: o.position.y }

			o.velocity.x += (o.force.x / o.weight) * DeltaTime.value
			o.velocity.y += (o.force.y / o.weight) * DeltaTime.value

			o.force.x = 0
			o.force.y = 0

			const frictionStep = o.friction * DeltaTime.value

			if (o.velocity.x > 0) {
				o.velocity.x = Math.max(0, o.velocity.x - frictionStep)
			}
			if (o.velocity.x < 0) {
				o.velocity.x = Math.min(0, o.velocity.x + frictionStep)
			}
			if (o.velocity.y > 0) {
				o.velocity.y = Math.max(0, o.velocity.y - frictionStep)
			}
			if (o.velocity.y < 0) {
				o.velocity.y = Math.min(0, o.velocity.y + frictionStep)
			}

			o.position.x += o.velocity.x * DeltaTime.value
			o.position.y += o.velocity.y * DeltaTime.value
		}
	}
}
