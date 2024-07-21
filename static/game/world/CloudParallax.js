export class CloudParallax {
	constructor() {
		this.sex = 'ja'

		this.cloudPositions = Iterate(10, i => ({
			position: Random.direction(Cam.position, 1000),
			picture: new Picture(new Position(0, 0, 400, 200), Random.choice([ '/static/assets/cloud.png', '/static/assets/cloud_2.png'])),
		}))
	}

	update() {
	}

	draw(draw, guiDraw) {
		for (const { position, picture } of this.cloudPositions) {

			position.x += 0.1
			position.y += 0.01


			const p = Parallax(position, -0.5)
			picture.position.x = p.x
			picture.position.y = p.y
			picture.draw(draw, guiDraw)
		}
	}
}
