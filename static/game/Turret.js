export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1, 1)

		this.position.width = 100
		this.position.height = 100


		this.localObjects = new LocalObjects([
			this.charge = new Charge(1, 10),
			this.turretNeeds = new TurretNeeds(this),
			G.Sprite.turret(this.position),
			this.motion = new Motion(),
		])
		this.motion.start()

		G.turrets.add(this)
	}

	get target() {
		return this.withinAny(800, G.monsters)
	}

	update() {
		this.position.scale(this.motion.value)
		this.localObjects.update()


		// if (this.charge.ready && this.target && !this.turretNeeds.needsSomething && this.ally && this.touches(this.ally)) {
		if (this.charge.ready && this.target) {
			this.charge.exhaust()

			const b = new Square(this.position.copy(), 10)

			Sound.sheet.play(1)

			b.update = () => {
				if (b.touchesAny(G.monsters)) {
					this?.target?.hp?.damage(10) // temporarry hack
					b.removeFromLoop()
				}
			}

			tla(b)

			this.moveTowards(this.target.position.center, 400)
		}
	}

	draw(draw) {
		this.localObjects.draw(draw)
		if (Mouse.touches(this)) {
			draw.radius(this.position.center, 400)
		}
		// draw.rectangle(this.position)
		// draw.circle(this.position.center)
	}
}
