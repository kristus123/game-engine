export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 1000)

		this.localObjects = Objects([
			G.Sprite.ally(this.position),
			this.sine = Sine(1, 2, 0.05),
			this.charge = Charge(1, 100),
			this.splash = Splash(),
			this.walkableAreas = WalkableAreas(),
			this.bounce = Bounce(this),
			this.linePathFinder = LinePathFinder(this, G.player, this.walkableAreas)
		])


		this.charge.position = this.position.offset(0, -100)



		G.allies.add(this)
	}

	update() {
		this.walkableAreas.enforce(this)

		this.localObjects.update()
	}

	draw(draw) {
		if (G.player.within(100, this) && this.charge.ready) {
			this.charge.exhaust()
			this.splash.random(this, 'orange')
			Money.increase(1)
			Html.fadeaway('+1', this.position.offset(-100))
			Audio.nya.playRandom()
			this.bounce.start()
		}

		if (this.turret == null || G.pause || !this.touches(this.turret)) {
			this.localObjects.draw(draw)
		}

		this.position.scale(this.sine.value)
	}

}
