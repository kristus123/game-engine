export class Npc extends GameObject {
	constructor() {
		super(-1000, -200, 35, 50, 100, 10)
		this.picture = new Picture(this, 'https://i.imgur.com/w9dZE0H.png')

	}

	onCollision(o) {
		Push(this).awayFrom(o, 50)
	}

	update() {
	}

	draw(draw) {
		this.picture.old_draw(draw, 100)
	}
}
