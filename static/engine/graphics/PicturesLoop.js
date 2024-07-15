export class PicturesLoop {
	constructor(position) {
		position.width = 250
		this.images = [
			new StaticPicture(position, '/static/assets/lift_1.png'),
			new StaticPicture(position, '/static/assets/lift_2.png'),
		]

		this.currentFrame = 0

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % this.images.length
		}, 200)
	}

	draw(draw, guiDraw) {
		this.images[this.currentFrame].draw(draw, guiDraw)
	}
}
