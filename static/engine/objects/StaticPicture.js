export class StaticPicture extends _GameObject {
	constructor(position, imagePath, scale=1) {
		super(position)

		this.picture = new Picture(position, imagePath, scale=1)
	}

	update() {

	}

	draw(draw, guiDraw) { // todo
		this.picture.draw(draw, guiDraw)
	}

}
