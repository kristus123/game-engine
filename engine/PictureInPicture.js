export class PictureInPicture {
	constructor() {
		this.position = Position(200, 100, 400, 500)
	}

	draw(draw) {
		const imageData = draw.ctx.getImageData(this.position.x, this.position.y, this.position.width, this.position.height)

		draw.ctx.putImageData(imageData,
			Mouse.position.x - Camera.position.x + (Palette.width/2),
			Mouse.position.y - Camera.position.y + (Palette.height/2))
	}
}

