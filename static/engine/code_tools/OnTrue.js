export class OnTrue {
	constructor(condition, action) {
		this.onChange = OnChange(condition, b => {
			if (b) {
				action(b)
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
