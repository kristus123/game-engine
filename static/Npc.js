export class Npc extends GameObject {
	constructor(player) {
		super(0, -200, 35, 50, 100, 10)
		this.p = new PrettyParticles()
		this.player = player
	}

	onCollision(o) {
		Push(this).awayFrom(o)
	}

	update() {
		Push(this).towards({x:500, y:1000})
	}

	draw(ctx) {
		Draw.player(ctx, this)

		if (Distance.withinRadius(this, this.player, 100)) {
			const message = 'Pissing in space ey\'? I\'ve seeen many piss, but none return'
			Draw.text(ctx, this.x , this.y - 150, 700, 100, message)
		}
	}
}
