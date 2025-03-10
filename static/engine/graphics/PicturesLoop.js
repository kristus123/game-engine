export class PicturesLoop {
	constructor(position) {
		position.width = 250
		this.pictures = [
			new StaticPicture(position, '/static/assets/lift_1.png'),
			new StaticPicture(position, '/static/assets/lift_2.png'),
		]

		this.currentFrame = 0

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % this.pictures.length
		}, 200)
	}

	draw(draw, guiDraw) {
		this.pictures[this.currentFrame].draw(draw, guiDraw)
	}
}
