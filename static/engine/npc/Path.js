export class Path {
	constructor(npc, points) {
		this.index = 0

		this.sine = new Sine(50, 0.1)
	}

	get position() {
		if (!this.completed) {
			return this.points[this.index]
		}
		else {
			return new Position(0, 0)
		}
	}

	update() {
		this.sine.update()

		const currentTarget = this.points[this.index]
		this.currentTarget = currentTarget

		if (this.npc.touches(currentTarget)) {
			if (this.index < this.points.length - 1) {
				this.index++
			}
		}
	}

	get completed() {
		return this.index >= this.points.length - 1 &&
		       this.npc.touches(this.points[this.points.length - 1])
	}

	draw(draw, guiDraw) {
		if (!this.completed) {
			draw.circle(this.currentTarget, this.sine.value)
		}

		for (let i = 0; i < this.points.length; i++) {
			const p = this.points[i]
			draw.rectangle(p)

			if (i < this.points.length - 1) {
				const next = this.points[i + 1]
				draw.line(p, next)
			}
		}
	}
}

