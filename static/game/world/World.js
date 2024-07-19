export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		const house = new House(this.player)

		const enemy = new Enemy(new Position(-465, 469), this.player, house)

		this.localObjects = new LocalObjects([
			house,
			enemy,
			this.player,
			new Sword(this.player, [enemy]),
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
