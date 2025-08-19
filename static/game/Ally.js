export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.pathFinder = new PathFinder(this, G.player),
			G.invisibleWalls,
			OnChange(() => this.friend && this.within(200, this.friend), dance => {
				this.dance = dance
			}),
			this.sine = new Sine(1.5, 0.05),

		])

		const otherAlly = G.allies.anyUnless(a => a == this && a.friend)

		if (otherAlly) {
			this.friend = otherAlly
			otherAlly.friend = this

			this.pathFinder.target = this.friend
			otherAlly.pathFinder.target = this
		}

		G.allies.add(this)
	}

	update() {
		this.localObjects.update()

		if (!this.stun) {
			if (this.turret) {
				ForcePush(this).towards(this.turret, 3)
			}
			else if (!this.dance) {
				ForcePush(this).towards(this.pathFinder.position, 3)
			}
		}

		const a = this.touchesAny(G.allies)
		if (a) {
			ForcePush(this).awayFrom(a, 3)
			ForcePush(a).awayFrom(this, 3)
			this.stun = true
			setTimeout(() => {
				this.stun = false
			}, 400);
			
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.dance) {
			this.position.scale(MinCap(0.5, this.sine.value))
			// draw.text(this.position, "😇")
		}
	}

}
