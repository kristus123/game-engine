export class Npc extends GameObject {
	constructor() {
		super(-900, -200, 50, 100, 100, 10)
		this.picture = new Picture(this, 'https://i.imgur.com/w9dZE0H.png')
	}

	onCollision(o) {
		ForcePush(this).awayFrom(o, 50)
	}

	update() {
	}

	draw(draw) {
		this.picture.draw(draw)
	}
}
