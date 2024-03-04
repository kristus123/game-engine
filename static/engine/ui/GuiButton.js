export class GuiButton {
	constructor(position, text, mouse, onClick=() => {}) {
	}

	update() {
		if (this.mouse.clickingGui(this.position)) {
			Call(this.onClick)
		}
	}

	draw(draw, guiDraw) {
		if (this.mouse.hoveringGui(this.position)) {
			guiDraw.new_rectangle(this.position, 'green')
			guiDraw.new_text(this.position.offset(0, 70), this.text, 'white')
		}
		else {
			guiDraw.new_rectangle(this.position, 'white')
			guiDraw.new_text(this.position.offset(0, 70), this.text, 'grey')
		}
	}
}
