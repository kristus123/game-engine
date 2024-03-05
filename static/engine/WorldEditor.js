export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new GameObject(0, 0, 10, 10, 4500, 50))

		const savedConfig = []

		this.runAll = new RunAll([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			// new Planet(500, 0),

			// new GuiButton(GuiPosition.bottomMiddle(10, -100, 100, 100), "hei", this.mouse, () => {
			// 	console.log("hei")
			// }),
			// new Grid(mouse),
		])

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



		this.runAll.draw(draw, guiDraw)
	}

}
