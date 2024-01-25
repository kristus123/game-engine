export class Button {
	constructor(position, text, mouse, onClick) {
		this.position = position
		this.text = text
		this.mouse = mouse
		this.onClick = onClick
		this.firstTimeFinish = new FirstTimeFinish(() => this.mouse.clicking(this.position))
	}

	update() {
		if (this.firstTimeFinish.returnTrueIfFinishedOnce()) {
			Call(this.onClick)
		}
	}

	draw(draw) {
		if (this.mouse.hovering(this.position)) {
			draw.new_rectangle(this.position, 'green')
			draw.new_text(this.position.center, this.text, 'white')
		}
		else {
			draw.new_rectangle(this.position, 'white')
			draw.new_text(this.position.center, this.text, 'grey')
		}
	}
}
