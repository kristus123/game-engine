export class Npc extends GameObject {
	constructor(player) {
		super(0, -200, 20, 20, 100, 10)
		this.p = new PrettyParticles()
		this.player = player
	}

	onCollision(o) {
		this.velocity.x = -o.velocity.x * 2
		this.velocity.y = -o.velocity.y * 2
	}

	update() {
		const vel = Calculate.velocity(this, {x:500, y:1000})

		this.velocity.x -= vel.x * Random.floatBetween(0.1, 0.4) * 1
		this.velocity.y -= vel.y * Random.floatBetween(0.1, 0.4) * 1
	}

	draw(ctx) {
		Draw.player(ctx, this)

		if (Distance.withinRadius(this, this.player, 100)) {
			Draw.text(ctx, this.x , this.y - 150, 700, 100, "Pissing in space ey'? I've seeen many piss, but none return")
		}
	}
}
