
export class WorldEditor {

	constructor(camera, mouse) {
		camera.followInstantly(new DynamicGameObject(0, 0, 10, 10, 4500, 50))

		this.runAll = new RunAll([
			new Controller().control(camera.objectToFollow),
			new StarBackground(camera),
			// new Planet(0, 0),
			// new Grid(mouse),
		])

		ObjectPersistence.get().forEach(o => {
			this.runAll.add(o)
		})

		mouse.addOnClick('paint', p => {
			p.height = 100
			p.width = 100
			const o = new DynamicGameObject(p.x, p.y, p.width, p.height, 100, 100)

			this.runAll.add(o)
			ObjectPersistence.save(o)
		})

		KeyDown('-', () => {
			console.log('zooming out')
			camera.zoom -= 0.5
		})

		KeyDown('_', () => {
			console.log('zooming in')
			camera.zoom += 1.5
		})
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
