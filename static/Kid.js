export class Kid extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 10)
		this.position.width = 170
		this.position.height = 300

		this.localObjects = new LocalObjects([
			new StaticPicture(this.position, '/static/assets/kid.png'),
			new FindCatQuest(this, player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
