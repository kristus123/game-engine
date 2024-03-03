export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new GameObject(0, 0, 10, 10, 100, 5))

		const savedConfig = []

		this.runAll = new RunAll([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			new Planet(500, 0),
		])
	}

	update() {
		// Push(this.camera.objectToFollow).towards(this.mouse.position, 0.5)

		for (const o of this.runAll.classes) {
			if (this.mouse.clicking(o)) {
				console.log("hei")
				o.position.x = this.mouse.position.x - 300
				o.position.y = this.mouse.position.y - 300
			}
			
		}

		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}

}
