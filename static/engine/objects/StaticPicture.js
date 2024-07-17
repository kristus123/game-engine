export class StaticPicture extends _GameObject {
	constructor(position, imagePath, scale=20) {
		super(position)

		this.picture = new Picture(position, imagePath, scale)
	}

	update() {

	}

	draw(draw, guiDraw) { // todo
		this.picture.draw(draw, guiDraw)
	}

}
