export class Npc extends GameObject {
	constructor(player) {
		super(0, -200, 35, 50, 100, 10)
		this.p = new PrettyParticles()
		this.player = player
		this.hp = 100
		this.maxHp = 100
		// this.velocity.x = -2000

		this.scriptedEvent = new ScriptedEvent((ctx) => {
			const goal = {x:100, y:-100}

			if (Distance.withinRadius(goal, this, 2000)) {
				Draw.text(ctx, this.x , this.y - 150, 700, 100, 'time to kill')
				// Push(this).towards(player)
			}
			else {
				Push(this).towards(goal)
			}
		})
	}

	onCollision(o) {
		Push(this).awayFrom(o, 50)
	}

	update() {
		// this.hp -= 0.1
	}

	draw(ctx) {

		Draw.hpBar(ctx, this.x, this.y, this.hp, this.maxHp)

		this.scriptedEvent.draw(ctx)

		Draw.player(ctx, this)
		Draw.coordinates(ctx, this)

		if (Distance.withinRadius(this, this.player, 100)) {
			const message = 'Pissing in space ey\'? I\'ve seeen many piss, but none return'
			Draw.text(ctx, this.x , this.y - 150, 700, 100, message)
		}
	}
}
