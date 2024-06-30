export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		Overlay.leftButton('exit edit mode', () => {
			Overlay.clearAll()
			Level.change(new World())
		})

		const mouseEditor = new MouseEditor()

		const chickens = new PersistedObjects('/persisted-objects/chickens.json')
		chickens.objects.forEach(o => {
			mouseEditor.add(o)
		})

		const grid = new Grid()
		Overlay.rightButton('chicken', () => {
			grid.show = false
			mouseEditor.onClick = p => {
				const c = new Chicken(p)
				chickens.add(c)
				mouseEditor.add(c)
			}
		})

		const floors = new PersistedObjects('/persisted-objects/floors.json')
		floors.objects.forEach(o => {
			mouseEditor.add(o)
		})
		Overlay.rightButton('floor', () => {
			grid.show = true
			mouseEditor.onClick = p => {
				const c = grid.add(p)
				floors.add(c)
				mouseEditor.add(c)
			}
		})

		mouseEditor.moved = o => {
			chickens.persist(o)
		}

		mouseEditor.remove = o => {
			chickens.remove(o)
		}

		Mouse.addOnClick('add object to world', p => {
			if (!mouseEditor.holding) {
				mouseEditor.onClick(p)
			}
		})

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			// new StarBackground(),
			//new Planet(new Position(0, 0)),
			grid,
			chickens,
			floors,
			mouseEditor,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
