export class Npc extends GameObject {
	constructor(mouse) {
		super(-1000, -200, 35, 50, 100, 10)
		this.mouse = mouse
		this.p = new PrettyParticles()
		this.hp = 100
		this.maxHp = 100
		this.picture = new Picture(this, 'https://i.imgur.com/w9dZE0H.png')

		this.chat = new FirstChat(this.position, mouse)
		setTimeout(() => {
			this.show = true
		}, 2000)
	}

	onCollision(o) {
		Push(this).awayFrom(o, 50)
	}

	update() {

	}

	draw(ctx) {
		this.picture.old_draw(ctx, 100)

		Draw.hpBar(ctx, this.x, this.y, this.hp, this.maxHp)

		this.chat.draw(ctx)
	}
}
