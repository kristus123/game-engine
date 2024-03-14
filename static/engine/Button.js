export class Button {
	constructor(position, text, mouse, onClick=() => {}) {
	}

	update() {
		RunOnce(this.mouse.clicking(this.position), () => {
			Call(this.onClick)
		})
	}

	draw(draw, guiDraw) {
		if (this.mouse.hovering(this.position)) {
			draw.new_rectangle(this.position, 'green')
			draw.new_text(this.position.offset(0, 70), this.text, 'white')
		}
		else {
			draw.new_rectangle(this.position, 'white')
			draw.new_text(this.position.offset(0, 70), this.text, 'grey')
		}
	}
}
