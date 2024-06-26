export class World {
	constructor() {

		this.player = new Player()
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			new StarBackground(),
			new PersistedObjects('/persisted-objects/chickens.json'),
			new PersistedObjects('/persisted-objects/floors.json'),
			this.player,
			new FirstQuest(this.player),
			new InvisibleWall(new Position(-200, 0, 100, 200), this.player),
			new InvisibleWall(new Position(200, 200, 100, 200), this.player),
		])

		Overlay.leftButton('edit mode', () => {
			Overlay.clearAll()
			Level.change(new WorldEditor(Cam))
		})

	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
