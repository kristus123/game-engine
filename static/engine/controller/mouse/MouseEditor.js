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
		if (this.lastClicked) {
			if (Mouse.down) {
				this.lastClicked.position.center.x = Mouse.position.x
				this.lastClicked.position.center.y = Mouse.position.y

				this.recentlyEditedObject = true
			}
			else if (Mouse.up) {
				console.log('moved')
				this.moved(this.lastClicked)
				this.lastClicked = null

				this.recentlyEditedObject = true
				setTimeout(() => {
					this.recentlyEditedObject = false
				}, 200)
			}

			// const deleteButton = this.lastClicked.position.offset(-10, -10, 20, 20)
			// if (Mouse.clicked(deleteButton)) {
			// 	console.log("delet e = ")
			// 	this.remove(this.lastClicked)
			// 	List.remove(this.objects, this.lastClicked)
			// 	this.lastClicked = null


		}
		else {
			for (const o of this.objects) {
				if (Mouse.clicked(o)) {
					this.lastClicked = o
					console.log('clicked new object')
					break
				}
			}
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
