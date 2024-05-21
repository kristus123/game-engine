export class MouseMove {
	constructor(mouse) {
		this.holding = null

		this.movableObjects = []
	}

	add(o) {
		this.movableObjects.push(o)
	}

	update() {
		for (const o of this.movableObjects) {
			if (!this.mouse.holding && this.mouse.clicked(o)) {
				this.holding = o
			}
			else if (o === this.holding) {
				o.position.center.x = this.mouse.position.x
				o.position.center.y = this.mouse.position.y
			}

			if (this.holding && this.mouse.up) {
				this.holding = null
				Call(this.moved)
			}
		}
	}

	draw(draw, guiDraw) {
		for (const o of this.movableObjects) {
			if (this.mouse.hovering(o) && !this.holding) {
				draw.new_text(o.position, 'click to move')
				break
			}
		}
	}

}
