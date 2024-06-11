export class MouseMove {
	constructor() {
		this.lastClicked = null
		this.holding = null

		this.movableObjects = []
	}

	add(o) {
		this.movableObjects.push(o)
	}

	update() {
		for (const o of this.movableObjects) {
			if (Mouse.clicked(o)) {
				this.lastClicked = o
			}

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
			if (o == this.lastClicked) {
				draw.transparentGreenRectangle(o)
				const x = o.position.offset(-10, -10, 20,20)
				draw.new_rectangle(x)
				if (Mouse.clicked(x)) {
					draw.new_text(o.position.offset(10, 10), 'delete')
					this.remove(o)
					this.lastClicked = null
				}
				draw.new_rectangle(x)
				if (Mouse.hovering(o)) {
					break
				}
			}

			if (Mouse.hovering(o) && !this.holding) {
				draw.new_text(o.position.offset(10, 10), 'click to move')
				break
			}
		}
	}

}
