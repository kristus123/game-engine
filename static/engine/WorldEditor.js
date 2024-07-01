export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		Overlay.leftButton('exit edit mode', () => {
			Overlay.clearAll()
			Level.change(new World())
		})

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			new PersistedObjectsEditor('/persisted-objects/chickens.json', p => new Chicken(p)),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
