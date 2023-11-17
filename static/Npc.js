export class Npc extends GameObject {
	constructor(player) {
		super(0, 0, 20, 20, 100, 10)
		this.p = new PrettyParticles()
		this.player = player
	}

	update() {
	}

	draw(ctx) {
		Draw.player(ctx, this)
		const circle = Draw.hollowCircle(ctx, this.x, this.y, 100)

		if (Calculate.insideCircle(this.player, circle)) {
			Draw.text(this.x, this.y, 100, 100, "Pissing in space ey'?")
		}
		else {
			console.log("outside")
		}
	}
}
