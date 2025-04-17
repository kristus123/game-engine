export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 200)

		// this.position.width = 145
		// this.position.height = 200

		this.defaultPicture = new StaticPicture(this.position, '/static/assets/snowman.png')
		this.behindPicture = new StaticPicture(this.position, '/static/assets/snowman_behind.png')

		this.steps = []
		setInterval(() => {
			this.steps.push(this.position.offset(50, 200, 50, 20).copy())
			List.retainMax(this.steps, 4)
		}, 400)

		this.god = new Sprite(this.position, '/static/assets/god_48x56.png', [{x:1,y:0}])
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
		// draw.hpBar(this.position.over(), 50, 100)
		// draw.objectThatIsCirclingAroundObjectBasedOnMousePosition(this)

		// if (super.movingUp) {
		// 	this.behindPicture.draw(draw, guiDraw)
		// }
		// else {
		// 	this.defaultPicture.draw(draw, guiDraw)
		// }

		// for (const o of this.steps) {
		// 	o.draw(draw, guiDraw)
		// 	draw.color(o, 'white')
		// }


		this.position.x = Math.round(this.position.x)
		this.position.y = Math.round(this.position.y)
		this.god.draw(draw, guiDraw)

	}
}
