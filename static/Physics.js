class Physics {
	constructor() {
		this.objects = []
	}

	add(o) {
		this.objects.push(o)
	}

	update(deltaTime) {
		for (let o of this.objects) {
			if (typeof deltaTime === 'number') {
				for (let anotherO of this.objects) {
					if (Collision.between(o, anotherO) && o !== anotherO) {
						console.log("COLLISSION !!!")
					}
				}

				o.x += o.velocity.x * deltaTime
				o.y += o.velocity.y * deltaTime
			}
		}
	}

	draw(ctx) {
		
	}
}
