export class StaticPicture {
	constructor(position, imagePath) {

		this.picture = new Picture(position, imagePath)
	}

	draw(draw, guiDraw) { // todo
		this.picture.draw(draw, guiDraw)
	}

	static mapFromJsonObject(json) {
		return new StaticPicture(ObjectMapper.positionFromJson(json.position), json.imagePath)
	}
}
