export class Chat {
	constructor(camera, mouse) {

		this.runAll = new RunAll([
		])

		// this.blur = new Blur(camera)
		this.thing = new SexyChat(new Position(0, -200), mouse)

		this.picture = new GameObject(-800, -400, 600, 600, 10, 10, '/static/assets/art/bar.jpg')
	}

	update() {
		this.runAll.update()

		this.thing.update()
	}

	draw(draw, guiDraw) {
		// this.blur.draw(draw, guiDraw)
		this.picture.draw(draw)
		this.thing.draw(draw)

		this.runAll.draw(draw, guiDraw)
	}

}
