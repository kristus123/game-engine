export class Dialogue {

	constructor(textTypers) {

		this.listLooper = new ListLooper(textTypers, (textTyper, next, finished, draw, guiDraw) => {
			textTyper.update()
			textTyper.draw(draw, guiDraw)

			if (textTyper.completed) {
				console.log('completed')
				next()
			}
		})
	}

	update() {
		this.listLooper.update()
	}

	draw(draw, guiDraw) {
		this.listLooper.draw(draw, guiDraw)
	}
}
