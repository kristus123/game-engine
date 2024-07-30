export class DragonRoom {
	constructor(player) {

		this.entrance = new DynamicGameObject(new Position(200, 2037, 100, 100), 1, 1)

		this.localObjects = new LocalObjects([
			new StaticPicture(new Position(0, 0, 100*20, 100*20), '/static/assets/dragon_room.png'),
			this.entrance,
		])
	}

	update() {
		this.localObjects.update()

		if (this.player.within(500, this.entrance)) {
			Cam.follow(this.entrance)
		}
		else {
			Cam.follow(this.player)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
