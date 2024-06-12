export class MouseMove {
	constructor() {
		this.holding = null

		this.movableObjects = []
	}

	add(o) {
		this.movableObjects.push(o)
	}

	update() {
		for (const o of this.movableObjects) {
			if (!Mouse.holding && Mouse.clicked(o)) {
				this.holding = o
			}
			else if (o === this.holding) {
				o.position.center.x = Mouse.position.x
				o.position.center.y = Mouse.position.y
			}

			if (this.holding && Mouse.up) {
				this.moved(this.holding)
				this.holding = null
			}
		}
	}

	draw(draw, guiDraw) {
		for (const o of this.movableObjects) {
			if (Mouse.hovering(o) && !this.holding) {
				draw.new_text(o.position, 'click to move')
				break
			}
		}
	}

}
