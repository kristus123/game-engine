export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1, 1)

		this.position.width = 100
		this.position.height = 100

		this.a = new Audio(G.Audio.sheet)

		this.localObjects = new LocalObjects([
			this.charge = new Charge(1, 10),
			this.sine = new Sine(5, 0.1),
			new After(500, () => {
			}),
		])
	}

	get target() {
		return this.withinAny(800, G.monsters)
	}

	update() {
		this.position.resize(this.sine.value)
		this.localObjects.update()

		if (this.charge.ready && this.target) {
			this.charge.exhaust()
				
			const b = new Square(this.position.copy(), 10)
			this.a.play(1)

			ForcePush(b).towards(this.target.position.center, 40)

			b.update = () => {
				if (b.touchesAny(G.monsters)) {
					this.target.hp.damage(10)
					b.removeFromLoop()
				}
			}

			tla(b)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		draw.rectangle(this.position)
		draw.radius(this.position.center, 800)
		draw.circle(this.position.center)
	}
}
