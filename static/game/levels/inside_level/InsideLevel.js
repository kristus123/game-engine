export class InsideLevel {
	constructor(level, camera, mouse) {
		this.controller = new Controller()

		this.player = new Player(mouse)
		camera.follow(this.player)

		this.controller.control(this.player)

		this.localObjects = new LocalObjects([
			this.player,
			VoidDialogue(this.player, this.mouse),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
