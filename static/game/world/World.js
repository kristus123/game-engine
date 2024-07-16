export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			this.player,
			new Rain(this.player.position.offset(0, -700, 900, 100)),
			new PersistedInvisibleWalls(this.player),
			{ person: new Person(new Position(200, 0), this.player) },
			new Kid(new Position(800, 0), this.player),
		], this)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
