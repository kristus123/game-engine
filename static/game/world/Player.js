export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 1)

		this.position.width = 145
		this.position.height = 200

		this.staticPicture = new StaticPicture(this.position, '/static/assets/player.png')
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.staticPicture.draw(draw, guiDraw)
	}
}
