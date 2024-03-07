export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new GameObject(0, 0, 10, 10, 4500, 50))

		this.starsRunAll = new RunAll()

		this.runAll = new RunAll([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			this.starsRunAll,
			new Planet(0, 0),
			new Grid(mouse),
		])

		this.selected = null
		this.runAll.add(new GuiButton(GuiPosition.bottomMiddle(10, -100, 400, 100), 'click to select a star to draw', this.mouse, () => {
			this.selected = Stars // new Stars
		}))

		mouse.addOnClick('paint', p => {
			this.starsRunAll.add(new this.selected(p.x, p.y))
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
		// Push(this.camera.objectToFollow).towards(this.mouse.position, 0.5)

		for (const o of this.runAll.classes) {
			if (this.mouse.clicking(o)) {
				o.position.center.x = this.mouse.position.x
				o.position.center.y = this.mouse.position.y
			}
		}

		this.runAll.update()
	}

	draw(draw, guiDraw) {
		if (this.selected) {
			new this.selected(this.mouse.position.x, this.mouse.position.y).draw(draw, guiDraw)
		}

		this.runAll.draw(draw, guiDraw)
	}
}
