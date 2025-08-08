export class World {
	constructor() {

		this.lightPosition = new Position(0,0)
		this.size = 100

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(-1000, -1000)),

			new Monster(),
			new Turret(new Position(0,-200)),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
