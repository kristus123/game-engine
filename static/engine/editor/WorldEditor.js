export class WorldEditor {

	constructor() {
		Cam.follow(new DynamicGameObject(new Position(0, 0, 10, 10), 4500, 50))
		Controller.control(Cam.objectToFollow)

		this.localObjects = new LocalObjects([
			Init(this, {
				player: new PlayerEditor(),
				invisibleWalls: new InvisibleWallsEditor(),
			}),

			new PersistedStaticPictureEditor('/static/assets/houses.png', '/persisted-objects/houses.json', 1700, 600),
			new PersistedStaticPictureEditor('/static/assets/stones/stone1.png', '/persisted-objects/stone1.json'),
			new PersistedStaticPictureEditor('/static/assets/stones/stone2.png', '/persisted-objects/stone2.json'),
			new PersistedStaticPictureEditor('/static/assets/stones/stone3.png', '/persisted-objects/stone3.json'),
			new PersistedStaticPictureEditor('/static/assets/bush.png', '/persisted-objects/bush.json', 200, 200),
			new PersistedStaticPictureEditor('/static/assets/tree.png', '/persisted-objects/tree.json', 400, 400),

			new PersistedObjectsEditor(
				'/persisted-objects/chickens.json',
				position => new Chicken(position),
				json => {
					const c = new Chicken(new Position(json.position.x, json.position.y))
					c.objectId = json.objectId
					return c
				},
			),

			new SimplePathFinder(this.player.player, this.invisibleWalls.persisted.persistedObjects.objects),

		])
	}

	exitEditMode() { // easy pz hack
		this.localObjects.remove(this.player)
		Overlay.clearAll()
		return this
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
