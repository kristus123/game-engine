export class CloudParallax {
	constructor() {
		this.picture = new StaticPicture(new Position(0,0, 400, 200), '/static/assets/cloud.png')

		this.cloudPositions = Iterate(10, i => ({
			position: Random.direction(Cam.position, 1000),
		}))
	}

	update() {
	}

	draw(draw, guiDraw) {
		for (const {position} of this.cloudPositions) {
			const p = Parallax(position, 0.2)
			this.picture.position.x = p.x
			this.picture.position.y = p.y
			this.picture.draw(draw, guiDraw)
		}
	}
}
