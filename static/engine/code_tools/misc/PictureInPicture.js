export class PictureInPicture {
	constructor() {
		this.position = new Position(0, 100, 200, 50)
	}

	draw(draw, guiDraw) {
		const ox = this.position.x - Cam.position.x + 200 + Mouse.position.x*0.8
		const oy = this.position.y - Cam.position.y + 200  + Mouse.position.y*0.8

		const xx = Mouse.position.x * 0.1
		const yy = Mouse.position.y * 0.1

		const imageData = draw.ctx.getImageData(this.position.x + ox, this.position.y + oy, this.position.width, this.position.height)

		draw.ctx.putImageData(imageData, xx + this.position.x + ox, yy + this.position.y + oy)
	}
}

