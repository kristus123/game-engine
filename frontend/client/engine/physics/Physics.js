export class Physics {

	static objects = []

	static apply(o) {
		this.objects.push(o)
		return o
	}

	static update() {
		for (const o of this.objects) {
			o.previousPosition = { x: o.x, y: o.y }

			o.velocity.x += (o.force.x / o.weight) * DeltaTime.value
			o.velocity.y += (o.force.y / o.weight) * DeltaTime.value

			o.force.x = 0
			o.force.y = 0

			const damping = Math.max(0, 1 - o.friction * DeltaTime.value)
			o.velocity.x *= damping
			o.velocity.y *= damping

			o.x += o.velocity.x * DeltaTime.value
			o.y += o.velocity.y * DeltaTime.value
		}
	}
}
