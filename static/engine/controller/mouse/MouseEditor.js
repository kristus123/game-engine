export class MouseEditor {

	static active = null

	constructor() {
		this.lastClicked = null

		this.objects = []

		this.onClick = position => {}

		Mouse.addOnClick('add object to world', p => {
			if (MouseEditor.active == this) {
				if (this.recentlyEditedObject) {
					console.log('ignore')
				}
				else {
					this.onClick(p)
				}
			}
		})
	}

	add(o) {
		this.objects.push(o)
	}

	update() {
		if (this.lastClicked && Mouse.up) {
			console.log("moved player")
			this.moved(this.lastClicked)
			this.lastClicked = null

			this.recentlyEditedObject = true
			setTimeout(() => {
				this.recentlyEditedObject = false
			}, 500)

			return
		}
		else if (this.lastClicked && Mouse.clicked(this.lastClicked.position.topLeft)) {
			this.remove(this.lastClicked)
			List.remove(this.objects, this.lastClicked)

			this.lastClicked = null
			this.recentlyEditedObject = true

			return
		}
		else if (this.lastClicked && Mouse.down) {
			this.lastClicked.position.center.x = Mouse.position.x
			this.lastClicked.position.center.y = Mouse.position.y

			this.recentlyEditedObject = true
		}
		else if (this.lastClicked && Distance.between(Mouse.position, this.lastClicked) > 100) {
			this.lastClicked = null
		}
		else for (const o of this.objects) {
			if (Mouse.clicked(o)) {
				this.lastClicked = o
				break
			}
		}
	}

	draw(draw, guiDraw) {
		for (const o of this.objects) {
			if (o == this.lastClicked) {

				draw.transparentGreenRectangle(o)

				draw.rectangle(o.position.topLeft)
				draw.rectangle(o.position.bottomRight)
				if (Mouse.hovering(o.position.topLeft)) {
					draw.text(o.position.offset(-150, 10), 'delete')
				}
				else if (Mouse.hovering(o.position.bottomRight)) {
					draw.text(o.position.offset(-150, 10), 'resize')
				}
			}

			if (Mouse.hovering(o) && Mouse.up) {
				draw.text(o.position.offset(10, 10), 'click to move')
				break
			}
		}
	}
}
