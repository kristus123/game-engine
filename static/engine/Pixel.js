export class Pixel {
	constructor(position) {

		this.position.width = 1
		this.position.height = 1
	}

	draw(draw, guiDraw) {
		draw.rectangle(this.position)
	}
}
