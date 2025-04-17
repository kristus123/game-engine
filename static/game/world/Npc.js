export class Npc extends DynamicGameObject {
	constructor(position, picture='/static/assets/old_man.png') {
		super(position, 100, 10)
		this.picture = new StaticPicture(this.position, picture)
	}

	update() {
		this.picture.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
	}
}
