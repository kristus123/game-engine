export class MouseEditor {

	static active = null

	constructor() {
		this.activeObject = null

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
		if (this.lastClicked && Mouse.rightDown) {
			this.lastClicked.position.width = Mouse.position.x - this.lastClicked.position.x
			this.lastClicked.position.height = Mouse.position.y - this.lastClicked.position.y
			this.moved(this.lastClicked)
		}
		else if (!this.activeObject && Mouse.downForLongerThan(100) && !this.firstClickedArea) {
			this.firstClickedArea = Mouse.position.copy()
		}
		else if (!this.activeObject && Mouse.down && this.firstClickedArea) {
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
		else if (this.activeObject && Mouse.up) {
			console.log('moved')
			this.moved(this.activeObject)
			this.lastClicked = this.activeObject
			this.activeObject = null

			this.recentlyEditedObject = true
			setTimeout(() => {
				this.recentlyEditedObject = false
			}, 500)
		}
		else if (this.activeObject && Mouse.clicked(this.activeObject.position.topLeft)) {
			this.remove(this.activeObject)
			List.remove(this.objects, this.activeObject)

			this.activeObject = null
			this.lastClicked = null
			this.recentlyEditedObject = true
		}
		else if (this.activeObject && Mouse.down) {
			this.activeObject.position.center.x = Mouse.position.x
			this.activeObject.position.center.y = Mouse.position.y

			this.recentlyEditedObject = true
			this.markedArea = null
			this.markedObjects = []
			Overlay.clearBottom()
		}
		else if (this.activeObject && Distance.between(Mouse.position, this.activeObject) > 100) {
			this.lastClicked = this.activeObject
			this.activeObject = null
		}
		else {
			for (const o of this.objects) {
				if (Mouse.clicked(o)) {
					this.activeObject = o
					this.lastClicked = null
					break
				}
			}
		}
	}

	draw(draw, guiDraw) {

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


		if (this.lastClicked && !this.activeObject) {
			draw.transparentGreenRectangle(this.lastClicked)

			draw.rectangle(this.lastClicked.position.topLeft, 'red')
			draw.rectangle(this.lastClicked.position.bottomRight)
			if (Mouse.hovering(this.lastClicked.position.topLeft)) {
				draw.text(this.lastClicked.position.offset(-150, 10), 'delete')
			}
			else if (Mouse.hovering(this.lastClicked.position.bottomRight)) {
				draw.text(this.lastClicked.position.offset(-150, 10), 'resize')
			}
		}


		if (this.activeObject) {
			for (const o of this.objects) {
				if (Mouse.hovering(o) && Mouse.up) {
					draw.text(o.position.offset(10, 10), 'click to move')
					break
				}
			}
		}
	}
}
