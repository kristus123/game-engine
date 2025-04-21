export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

		this.position.width = 110
		this.position.height = 150

		this.defaultPicture = new Picture(this.position, '/static/assets/snowman.png')
		this.behindPicture = new Picture(this.position, '/static/assets/snowman_behind.png')

		this.steps = []
		setInterval(() => {
			this.steps.push(this.position.offset(50, 200, 50, 20).copy())
			List.retainMax(this.steps, 4)
		}, 400)
	}

	update() {
		for (const e of Registry.enemies) {
			if (e.within(100, this)) {
				if (e.blinded) {
					e.kill()
				}
			}
		}
	}

	draw(draw, guiDraw) {
		if (super.movingUp) {
			this.behindPicture.draw(draw, guiDraw)
		}
		else {
			this.defaultPicture.draw(draw, guiDraw)
		}

		this.position.x = Math.round(this.position.x)
		this.position.y = Math.round(this.position.y)
	}
}
