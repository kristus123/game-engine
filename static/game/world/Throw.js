export class Throw {
	constructor(objectToThrow) {
		this.objects = new LocalObjects()

		KeyDown('q', () => {
			const o = objectToThrow() 
			this.objects.add(o)

			ForcePush(o).towards(Mouse.position, 200)
		})
	}
	
	update() {
		this.objects.update()

		for (const rock of this.objects) {
			const chicken = rock.touchesAny(Registry.Chicken)
			if (chicken && chicken.alive) {
				chicken.kill()
				rock.removeFromLoop()
			}
		}
	}

	draw(draw, guiDraw) {
		this.objects.draw(draw, guiDraw)
	}
}
