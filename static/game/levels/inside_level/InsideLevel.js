export class InsideLevel {
	constructor(level, camera) {

		this.player = new Player()
		Cam.follow(this.player)

		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			this.player,
			VoidDialogue(this.player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
