class Flake extends Entity {

	constructor(p) {
		super(p)

		this.y = 400

		const size = Random.floatBetween(1, 2) * 10
		this.position.width = size
		this.position.height = size
	}

	update() {
		this.y -= 1

		if (this.landed) {
			D2.rectangle(this.position, "white")
		}
		else {
			this.position.rescale(0.99)
			D1.rectangle(this.position, "white")
		}
	}

	get landed() {
		return this.y <= 0
	}

}

export class Snow {
	constructor(importantPosition) {
		this.flakes = []
	}

	update() {
		const f = new Flake(Random.direction(this.importantPosition.copy(), 800))
		f.pushTo(f.position.copy(Random.integerBetween(100, 200), Random.integerBetween(200, 10_000)), 19_000)
		this.flakes.push(f)

		for (const f of this.flakes) {
			f.update()
		}
	}

}
