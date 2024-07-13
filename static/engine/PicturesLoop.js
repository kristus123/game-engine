export class PicturesLoop {
	constructor(position) {
		position.width = 250
		this.localObjects = new LocalObjects([
			new StaticPicture(position, '/static/assets/lift_1.png'),
			new StaticPicture(position, '/static/assets/lift_2.png'),
		])

		this.currentFrame = 0
		const totalFrames = 2

		setInterval(() => {
			this.currentFrame = (this.currentFrame + 1) % totalFrames
		}, 200)
	}

	draw(draw, guiDraw) {
		this.localObjects.objects[this.currentFrame].draw(draw, guiDraw)
	}
}
