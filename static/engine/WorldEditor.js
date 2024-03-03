export class WorldEditor {

	constructor(camera, mouse) {

		const savedConfig = []

		this.runAll = new RunAll([
			new StarBackground(camera),
			new GameObject(500, 0, 1500, 1500, 1, 1),
			// new Picture(new GameObject(500, 0, 1500, 1500, 1, 1), '/static/assets/planets/exoplanet32x32.png'),
			// {
			// 	draw: draw => draw.gradient(new Position(1250, 750)),
			// },
			// new Picture(new GameObject(-3491, 2101, 800, 800, 1, 1), '/static/assets/planets/moon27x26.png'),
			// new Picture(new GameObject(2100, 5000, 3000, 3000, 1, 1), '/static/assets/planets/sun.png'),
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
