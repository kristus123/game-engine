export class Npc extends DynamicGameObject {
	constructor() {
		super(new Position(-900, -200, 50, 100), 100, 10)
		this.picture = new Picture(this, 'https://i.imgur.com/w9dZE0H.png')
	}

	onCollision(o) {
		ForcePush(this).awayFrom(o, 50)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
	}
}
