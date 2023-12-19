export class Npc extends GameObject {
	constructor() {
		super(-300, 10, 35, 50, 100, 10)
		this.p = new PrettyParticles()
		this.hp = 100
		this.maxHp = 100
		this.picture = new Picture(this, 'https://i.imgur.com/w9dZE0H.png')
		// this.velocity.x = -2000
	}

	onCollision(o) {
		Push(this).awayFrom(o, 50)
	}

	update() {
		// this.hp -= 0.1
	}

	draw(ctx) {
		this.picture.old_draw(ctx, 100)

		Draw.hpBar(ctx, this.x, this.y, this.hp, this.maxHp)
	}
}
