export class Button {
	constructor(position, text, mouse) {
		this.position = position
		this.mouse = mouse
	}

	draw(draw) {
		if (this.mouse.hovering(this.position)) {
			draw.new_rectangle(this.position, 'green')
			draw.text(this.position.center, 'green')
		}
		else {
			draw.new_rectangle(this.position, 'white')
			
		}
	}
}
