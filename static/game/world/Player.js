export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 2)

		this.position.width = 145
		this.position.height = 200

		this.staticPicture = new StaticPicture(this.position, '/static/assets/snowman.png')

		this.steps = []
		setInterval(() => {
			this.steps.push(this.position.offset(50, 200, 50, 20).copy())
			List.retainMax(this.steps, 4)
		}, 400)
	}

	update() {
	}

	draw(draw, guiDraw) {

		for (const o of this.steps) {
			o.draw(draw, guiDraw)
			draw.color(o, 'white')
		}

		this.staticPicture.draw(draw, guiDraw)
	}
}
