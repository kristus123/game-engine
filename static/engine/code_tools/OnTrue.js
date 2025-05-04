export class OnTrue {
	constructor(condition, action) {
		this.onChange = new OnChange(condition, b => {
			if (b) {
				action()
			}
		})
	}

	update() {
		this.onChange.update()
	}

	draw(draw, guiDraw) {
		this.onChange.draw(draw, guiDraw)
	}
}
