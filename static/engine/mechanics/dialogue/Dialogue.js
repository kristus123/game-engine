export class Dialogue {

	constructor(textTypers) {

		this.listLooper = new ListLooper(textTypers, (textTyper, next, completed, draw, guiDraw) => {
			textTyper.update()
			textTyper.draw(draw, guiDraw)

			if (textTyper.completed()) {
				next()
			}
		})
	}

	completed() {
		return this.listLooper.completed()
	}

	update() {
		this.listLooper.update()
	}

	draw(draw, guiDraw) {
		this.listLooper.draw(draw, guiDraw)
	}
}
