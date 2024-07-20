export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			this.player,
			new Sword(this.player, []),
			new CloudParallax(),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
			new PathFinder(new Square(new Position(0,0), 20), new PersistedInvisibleWalls(this.player).walls.objects, this.player)
		], this)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
