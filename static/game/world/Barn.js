export class Barn extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 20
		this.position.height = 20

		this.localObjects = new LocalObjects()

		this.sleepyTime = true

		setInterval(() => {
			this.sleepyTime = !this.sleepyTime

			for (const m of G.monsters) {
				m.sleepyTime = this.sleepyTime
			}
		}, 5_000)
	}

	update() {
		this.localObjects.update()
		console.log(this.sleepyTime)
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		console.log(Mouse.position.x)

		super.draw(draw, guiDraw)
	}
}
