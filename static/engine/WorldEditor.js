export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		Overlay.leftButton('exit edit mode', () => {
			Overlay.clearAll()
			Level.change(new World())
		})

		const mouseMove = new MouseMove()

		this.chickens = new PersistedObjects('/persisted-objects/data.json')
		this.chickens.objects.forEach(o => {
			mouseMove.add(o)
		})

		this.add = null
		const grid = new Grid()

		Overlay.bottomButton('chicken', () => {
			grid.show = false
			this.add = p => new Chicken(p)
		})

		// Overlay.bottomButton('grid', () => {
		// 	grid.show = true
		// 	this.add = p => grid.add(p)
		// })

		mouseMove.moved = o => {
			this.chickens.persist(o)
		}
		mouseMove.remove = o => {
			this.chickens.remove(o)
		}

		Mouse.addOnClick('add object to world', p => {
			if (this.add) {
				const o = this.add(p)
				mouseMove.add(o)
				this.chickens.add(o)
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
		this.chickens.update()
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.chickens.draw(draw, guiDraw)
		this.localObjects.draw(draw, guiDraw)
	}
}
