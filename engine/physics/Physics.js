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
			o.previousPosition = { x: o.x, y: o.y }

			o.x += o.velocity.x
			o.y += o.velocity.y
		}
	}

}
