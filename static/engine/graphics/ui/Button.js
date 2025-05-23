export class Button {
	constructor(position, text, onClick= (b) => {}) {
		this.button = Html.button(text, onClick)
		this.update()
	}

	update() {
		const offsetX = this.position.x - Camera.position.x + (Palette.width/2)
		const offsetY = this.position.y - Camera.position.y + (Palette.height/2)

		this.button.style.left = `${offsetX}px`
		this.button.style.top = `${offsetY}px`
	}

	draw(draw, guiDraw) {
	}
}
