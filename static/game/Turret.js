export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1, 1)

		this.position.width = 100
		this.position.height = 100

		this.a = new Audio(G.Audio.sheet)

		this.localObjects = new LocalObjects([
			this.charge = new Charge(1, 10),
			G.Sprite.turret(this.position),
			this.motion = new Motion(),
		])
		this.motion.start()
	}

	get target() {
		return this.withinAny(800, G.monsters)
	}

	update() {
		this.position.scale(this.motion.value)
		this.localObjects.update()

		if (this.charge.ready && this.target) {
			this.charge.exhaust()

			const b = new Square(this.position.copy(), 10)
			this.a.play(1)

			ForcePush(b).towards(this.target.position.center, 400)

			b.update = () => {
				if (b.touchesAny(G.monsters)) {
					this?.target?.hp?.damage(10) // temporarry hack
					b.removeFromLoop()
				}
			}

			tla(b)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.rectangle(this.position)
		// draw.radius(this.position.center, 800)
		// draw.circle(this.position.center)
	}
}
