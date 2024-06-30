export class MouseEditor {
	constructor() {
		this.lastClicked = null
		this.holding = null

		this.movableObjects = []

		this.onClick = null
	}

	add(o) {
		this.movableObjects.push(o)
	}

	update() {
		for (const o of this.movableObjects) {
			if (o == this.holding) {
				o.position.center.x = Mouse.position.x
				o.position.center.y = Mouse.position.y
			}
			else if (Mouse.clicked(o) && !this.holding) {
				this.holding = o
				this.lastClicked = o
				break
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
				const x = o.position.offset(-10, -10, 20, 20)
				draw.rectangle(x)
				if (Mouse.hovering(x)) {
					draw.text(o.position.offset(-150, 10), 'delete')
				}
				if (Mouse.clicked(x)) {
					this.remove(o)
					this.lastClicked = null
					this.holding = null
				}
				draw.rectangle(x)
				if (Mouse.hovering(o)) {
					break
				}
			}

			if (Mouse.hovering(o) && !this.holding) {
				draw.text(o.position.offset(10, 10), 'click to move')
				break
			}
		}
	}

}
