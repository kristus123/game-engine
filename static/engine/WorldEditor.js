export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new GameObject(0, 0, 10, 10, 4500, 50))

		this.starsRunAll = new RunAll()

		this.runAll = new RunAll([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			this.starsRunAll,
			new Planet(0, 0),
			// new Grid(mouse),
		])

		mouse.addOnClick('paint', p => {
			const o = new GameObject(p.x, p.y, 100, 100, 10, 10)
			o.corner = o.position.offset(o.width - 20, o.height, 50, 50)
			this.runAll.add(o)
		})

		new KeypressEvent().addKeyDownListener('-', () => {
			console.log('zooming out')
			camera.zoom -= 0.5
		})

		new KeypressEvent().addKeyDownListener('_', () => {
			console.log('zooming in')
			camera.zoom += 0.5
		})
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)

		for (const o of this.runAll.classes) {

			if (o.position) {
				if (this.mouse.hovering(o.position.corner.bottom.right)) {
					draw.new_text(o.position.offset(0, -50), 'resize')
				}

				if (this.mouse.holdingO(o.position.corner.bottom.right)) {


					o.position.width = this.mouse.position.x - o.position.x
					o.position.height = this.mouse.position.y - o.position.y

					o.position.corner.bottom.right.offset.x = o.position.width
					o.position.corner.bottom.right.offset.y = o.position.height
				}

				draw.new_rectangle(o.position.corner.bottom.right, 'orange')
			}

			this.mouse.moveIf(o)

			if (this.mouse.hovering(o) && !this.mouse.holding) {
				draw.new_text(o.position.offset(0, -50), 'edit')
			}
		}
	}
}
