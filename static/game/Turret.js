export class Turret extends DynamicGameObject {
	constructor(position) {
		super(position, 1,1)

		this.position.width = 100
		this.position.height = 100


		this.localObjects = new LocalObjects([
			Init(this, {
				charge: new Charge(1, 10),
			}),
		])
	}
	
	update() {
		this.localObjects.update()


		const m = this.withinAny(400, G.monsters)
		if (m && this.charge.ready) {
			this.charge.exhaust()

			const s = new Square(this.position.copy(), 10)
			ForcePush(s).towards(m, 200)
			s.update = () => {
				if (s.touches(m)) {
					console.log("hit")
					s.removeFromLoop()
				}
			}

			this.localObjects.add(s)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		draw.rectangle(this.position)
	}
}
