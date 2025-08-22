export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.pathFinder = new PathFinder(this, G.player),
			this.sine = new Sine(1, 2, 0.05),
			this.charge = new Charge(1, 100),
			this.splash = new Splash()
		])

		this.charge.position = this.position.offset(0, -100)


		this.turret = G.turrets.anyUnless(t => t.ally)
		if (this.turret) {
			this.turret.ally = this
		}

		G.allies.add(this)
	}

	update() {
		this.localObjects.update()

		if (G.pause) {
			this.pathFinder.target = G.player
		}
		else {
			if (this.turret) {
				this.pathFinder.target = this.turret
			}
		}

		ForcePush(this).towards(this.pathFinder.position, 80)
	}

	draw(draw, guiDraw) {
		if (G.player.within(100, this) && this.charge.ready) {
			draw.text(this.position, 'E')
			if (Keyboard.e) {
				this.charge.exhaust()
				this.splash.random(this, 'orange')
			}
		}

		if (this.turret == null || G.pause || !this.touches(this.turret)) {
			this.localObjects.draw(draw, guiDraw)
		}

		this.position.scale(this.sine.value)
	}

}
