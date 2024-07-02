export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))

		this.localObjects = new LocalObjects([
			Controller.control(Cam.objectToFollow),
			new PersistedObjectsEditor('/persisted-objects/chickens.json', p => new Chicken(p)),
			new PersistedObjectsEditor('/persisted-objects/invisible_walls.json', p => new InvisibleWall(p)),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
