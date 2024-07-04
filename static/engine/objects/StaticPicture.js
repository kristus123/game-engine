export class StaticPicture extends _GameObject {
	constructor(position, imagePath) {
		super(position)

		this.picture = new Picture(position, imagePath)
	}

	update() {

	}

	draw(draw, guiDraw) { // todo
		this.picture.draw(draw, guiDraw)
	}

}
