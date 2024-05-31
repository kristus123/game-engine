export class Picture {
	constructor(position, imagePath) {

		this.image = new Image()
		this.image.src = imagePath
	}

	draw(draw, guiDraw) { // todo
		draw.image(this.image, this.position)
	}

}
