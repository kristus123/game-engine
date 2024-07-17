export class World {
	constructor() {

		this.player = new PlayerEditor().player
		Cam.followInstantly(this.player)
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
<<<<<<< HEAD
			house,
||||||| 630591f (x)
			house,
			new Thing(new Position(-465, 469), this.player, house),
=======
>>>>>>> parent of 630591f (x)
			this.player,
<<<<<<< HEAD
			new Penguin(new Position(-465, 469), this.player, house),
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
||||||| 630591f (x)
			new Rain(this.player.position.offset(-1200, -1000, 2500, 100)),
=======
			new Rain(this.player.position.offset(-1500, -1000, 2000, 100)),
>>>>>>> parent of 630591f (x)
		], this)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
