export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1, 1)

		this.position.width = 100
		this.position.height = 100


		this.localObjects = new LocalObjects([
			Init(this, {
				charge: new Charge(5, 10),
			}),
		])
	}

	update() {
		this.localObjects.update()


		const m = this.withinAny(800, G.monsters)
		if (m && this.charge.ready) {
			this.charge.exhaust()

			const s = new Square(this.position.copy(), 10)
			ForcePush(s).towards(m.position.center, 400)
			s.update = () => {
				if (s.touchesAny(G.monsters)) {
					console.log('hit')
					m.hp.damage(10)
					s.removeFromLoop()
					G.monsters.remove(m)
				}
			}

			this.localObjects.add(s)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		draw.rectangle(this.position)
		draw.radius(this.position, 800)
	}
}
