export class Dialogue {
	constructor(multiTextTypers) {

		this.multiTextTypers = new ListLooper(multiTextTypers)
	}

	update() {
		if (this.multiTextTypers.finished) {
			this.removeFromLoop()
		}
	}

	draw(draw, guiDraw) {
		this.multiTextTypers.goThrough(textTyper => {
			textTyper.update()
			textTyper.draw(draw, guiDraw)

			if (textTyper.finished) {
				this.multiTextTypers.next()
			}
		})
	}
}
