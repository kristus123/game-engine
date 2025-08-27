export class PictureInPicture {
	constructor() {
		this.position = new Position(200, 100, 400, 500)
	}

	draw() {
		const imageData = Draw.ctx.getImageData(this.position.x, this.position.y, this.position.width, this.position.height)

		Draw.ctx.putImageData(imageData,
			Mouse.position.x - Camera.position.x + (Palette.width/2),
			Mouse.position.y - Camera.position.y + (Palette.height/2))
	}
}

