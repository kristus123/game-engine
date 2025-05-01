export class Throw {
	constructor() {
		this.localObjects = new LocalObjects()

		KeyDown('q', () => {
			const rock = new Square(G.player.position.copy(), 20)
			this.localObjects.add(rock)

			ForcePush(rock).towards(Mouse.position, 200)
		})

	}
	
	update() {
		this.localObjects.update()


		for (const rock of this.localObjects) {
			const chicken = rock.touchesAny(Registry.Chicken)
			if (chicken && chicken.alive) {
				chicken.kill()
				rock.removeFromLoop()
			}
			
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
