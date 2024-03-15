export class DatingSimLevel {
	constructor(levelSelector, camera, mouse) {

		this.runAll = new RunAll([
			new Chat(camera, mouse),
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw, guiDraw) {
		this.runAll.draw(draw, guiDraw)
	}
}
