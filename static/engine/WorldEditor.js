export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		Overlay.leftButton('exit edit mode', () => {
			Overlay.clearAll()
			Level.change(new World())
		})

		const mouseMove = new MouseMove()

		const chickens = new PersistedObjects('/persisted-objects/chickens.json')
		this.chickens = chickens
		chickens.objects.forEach(o => {
			mouseMove.add(o)
		})

		const grid = new Grid()
		Overlay.rightButton('chicken', () => {
			grid.show = false
			mouseMove.onClick = p => {
				const c = new Chicken(p)
				chickens.add(c)
				mouseMove.add(c)
			}
		})

		const floors = new PersistedObjects('/persisted-objects/floors.json')
		floors.objects.forEach(o => {
			mouseMove.add(o)
		})
		Overlay.rightButton('floor', () => {
			grid.show = true
			mouseMove.onClick = p => {
				const c = grid.add(p)
				floors.add(c)
				mouseMove.add(c)
			}
		})

		mouseMove.moved = o => {
			chickens.persist(o)
		}

		mouseMove.remove = o => {
			chickens.remove(o)
		}

		Mouse.addOnClick('add object to world', p => {
			if (!mouseMove.holding) {
				mouseMove.onClick(p)
			}
		})

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			// new StarBackground(),
			//new Planet(new Position(0, 0)),
			grid,
			chickens,
			floors,
			mouseMove,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
