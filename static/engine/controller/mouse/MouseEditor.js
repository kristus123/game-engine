export class MouseEditor {
	constructor() {
		this.lastClicked = null
		this.holding = null

		this.objects = []

		this.onClick = null

		this.clickEvent = null
		Mouse.addOnClick('add object to world', p => {
			this.clickEvent = p
		})
	}

	add(o) {
		this.objects.push(o)
	}

	update() {

		for (const o of this.objects) {
			if (Mouse.down && o == this.holding) {
				o.position.center.x = Mouse.position.x
				o.position.center.y = Mouse.position.y
			}
			else if (Mouse.up && this.holding) {
				this.moved(this.holding)
				this.holding = null
			}
			else if (Mouse.clicked(o) && !this.holding) {
				this.holding = o
				this.lastClicked = o
			}
			else if (this.lastClicked == o) {
				const deleteButton = o.position.offset(-10, -10, 20, 20)
				if (Mouse.clicked(deleteButton)) {
					this.remove(o)
					List.remove(this.objects, o)
					this.lastClicked = null
					this.holding = null

					this.recentlyDeletedObject = true
					setTimeout(() => {
						this.recentlyDeletedObject = false
					}, 100);
				}
			}
		}

		if (this.clickEvent && this.recentlyDeletedObject) {
			this.clickEvent = null
		}
		else if (this.clickEvent && !this.lastClicked && !this.holding) {
			this.onClick(this.clickEvent)
			this.clickEvent = null
		}
	}

	draw(draw, guiDraw) {
		for (const o of this.objects) {
			if (o == this.lastClicked) {

				draw.transparentGreenRectangle(o)

				const deleteButton = o.position.offset(-10, -10, 20, 20)
				draw.rectangle(deleteButton)
				if (Mouse.hovering(deleteButton)) {
					draw.text(o.position.offset(-150, 10), 'delete')
				}

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
