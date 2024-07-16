export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		const house = new House(this.player)

		this.localObjects = new LocalObjects([
			house,
			new Thing(new Position(-465, 469), this.player, house),
			this.player,
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
		], this)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
