export class PictureInPicture {
	constructor() {
		this.position = new Position(200, 100, 400, 500)
	}

	draw(draw, guiDraw) {
		const imageData = draw.ctx.getImageData(this.position.x, this.position.y, this.position.width, this.position.height)

		draw.ctx.putImageData(imageData,
			Mouse.position.x - Cam.position.x + (Palette.width/2),
			Mouse.position.y - Cam.position.y + (Palette.height/2))
	}
}

