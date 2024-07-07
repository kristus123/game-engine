export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			// new StarBackground(),
			// new PersistedObjects('/persisted-objects/chickens.json'),
			// new PersistedObjects('/persisted-objects/floors.json'),
			this.player,
			new Noise(new Position(0, 0, 1000, 1000), 10),
			// new FirstQuest(this.player),
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
