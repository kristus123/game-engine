export class Npc extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 10)
		this.picture = new StaticPicture(this.position, '/static/assets/old_man.png')
	}

	update() {
		this.picture.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
	}
}
