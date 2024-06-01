export class Npc extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 10)
		this.picture = new Picture(this, 'https://i.imgur.com/w9dZE0H.png')
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
	}
}
