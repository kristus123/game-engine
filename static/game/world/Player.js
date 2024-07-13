export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 10)

		this.position.width = 145
		this.position.height = 200

		this.staticPicture = new StaticPicture(this.position, '/static/assets/petter.png')

		this.steps = []
		setInterval(() => {
			this.steps.push(this.position.offset(50, 200, 50, 20).copy())
			List.retainMax(this.steps, 3)
		}, 200)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.staticPicture.draw(draw, guiDraw)

		for (const o of this.steps) {
			o.draw(draw, guiDraw)
		}
	}
}
