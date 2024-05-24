export class StaticPicture {
	constructor(position, src) {

		this.picture = new Picture(position, src)
	}

	draw(draw, guiDraw) { // todo
		this.picture.draw(draw, guiDraw)
	}
}

