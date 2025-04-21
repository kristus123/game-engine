const texts = []

export class Text {
	constructor(position, text) {
		this.t = Html.floating(Html.text(text), position)

		texts.push(this)
	}

	static updateAll() {
		for (const t of texts) {
			Html.floatingPosition(t.t, t.position)
		}
	}

	show() {
		Html.show(this.t)
	}

	hide() {
		Html.hide(this.t)
	}

	draw(draw, guiDraw) {
	}
}
