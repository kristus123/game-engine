export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		const mouseMove = new MouseMove()
		this.worldObjects = new LocalObjects()

		ObjectPersistence.get().forEach(o => {
			this.worldObjects.add(o)
			mouseMove.add(o)
		})

		this.add = null
		const grid = new Grid()

		Overlay.bottomButton('chicken', () => {
			grid.show = false
			this.add = p => new Chicken(p)
		})

		Overlay.bottomButton('grid', () => {
			grid.show = true
			this.add = p => grid.add(p)
		})

		mouseMove.moved = o => {
			ObjectPersistence.update(o)
		}
		mouseMove.remove = o => {
			ObjectPersistence.remove(o)
			this.worldObjects.remove(o)
		}

		Mouse.addOnClick('add object to world', p => {
			if (this.add) {
				const o = this.add(p)

				this.worldObjects.add(o)
				mouseMove.add(o)
				ObjectPersistence.save(o)
			}
		})

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			new StarBackground(),
			//new Planet(new Position(0, 0)),
			grid,
			mouseMove,
		])
	}

	update() {
		this.worldObjects.update()
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.worldObjects.draw(draw, guiDraw)
		this.localObjects.draw(draw, guiDraw)
	}
}
