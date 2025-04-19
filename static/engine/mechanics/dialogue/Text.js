export class Text {
	constructor(position, text) {
		this.t = Html.floating(Html.text(text), position)
		Html.addToScreen(this.t)
	}

	update() {
 		Html.floatingPosition(this.t, this.position)
	}

	show() {
		Html.show(this.t)
		
	}

	hide() {
	}

	draw(draw, guiDraw) {
	}
}
