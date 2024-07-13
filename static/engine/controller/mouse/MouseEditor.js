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

		this.firstClickedArea = null
		this.markedArea = null
		this.markedObjects = []
	}

	add(o) {
		this.objects.push(o)
	}

	update() {
		if (!this.lastClicked && Mouse.downForLongerThan(200) && !this.firstClickedArea) {
			this.firstClickedArea = Mouse.position.copy()
		}
		else if (!this.lastClicked && Mouse.down && this.firstClickedArea) {
			this.markedArea = new Position(
				this.firstClickedArea.x,
				this.firstClickedArea.y,
				Mouse.position.x - this.firstClickedArea.x,
				Mouse.position.y - this.firstClickedArea.y)

			this.recentlyEditedObject = true
		}
		else if (this.firstClickedArea && Mouse.up) {
			this.firstClickedArea = null
			this.recentlyEditedObject = true
			setTimeout(() => {
				this.recentlyEditedObject = false
			}, 200)
		}
		else if (this.lastClicked && Mouse.up) {
			console.log('moved player')
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
			this.markedArea = null
			this.markedObjects = []
			Overlay.clearBottom()
		}
		else if (this.lastClicked && Distance.between(Mouse.position, this.lastClicked) > 100) {
			this.lastClicked = null
		}
		else {
			for (const o of this.objects) {
				if (Mouse.clicked(o)) {
					this.lastClicked = o
					break
				}
			}
		}
	}

	draw(draw, guiDraw) {
		console.log(this.markedObjects.length)

		if (this.firstClickedArea && this.markedArea) {
			draw.transparentGreenRectangle(this.markedArea)

			for (const o of this.objects) {
				if (Collision.between(o, this.markedArea)) {
					if (List.empty(this.markedObjects)) {
						Overlay.bottomButton('delete', () => {
							for (const o of this.markedObjects) {
								this.remove(o)
								List.remove(this.objects, o)
							}

							this.markedObjects = []

							Overlay.clearBottom()
						})
					}

					if (!List.includes(this.markedObjects, o)) {
						this.markedObjects.push(o)
					}
				}
			}
		}

		for (const o of this.markedObjects) {
			draw.text(o.position.offset(0, -100), 'marked')
		}

		if (this.lastClicked) {
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
}
