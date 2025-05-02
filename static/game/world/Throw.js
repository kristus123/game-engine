export class Throw {
	constructor() {
		this.rocks = new LocalObjects()

		KeyDown('q', () => {
			const rock = new Square(G.player.position.copy(), 20)
			this.rocks.add(rock)

			ForcePush(rock).towards(Mouse.position, 200)
		})
	}
	
	update() {
		this.rocks.update()

		for (const rock of this.rocks) {
			const chicken = rock.touchesAny(Registry.Chicken)
			if (chicken && chicken.alive) {
				chicken.kill()
				rock.removeFromLoop()
			}
		}
	}

	draw(draw, guiDraw) {
		this.rocks.draw(draw, guiDraw)
	}
}
