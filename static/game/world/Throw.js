export class Throw {
	constructor(objectToThrow, action= (o) => {}) {
		this.objects = new LocalObjects()

		KeyDown('q', () => {
			const o = objectToThrow() 
			this.objects.add(o)

			const p = Mouse.position.copy()

			ForcePush(o).towards(p, 100)

			setTimeout(() => {
				ForcePush(o).towards(p, 40)
			}, 100);

			setTimeout(() => {
				o.velocity.reset()
			}, 600);

			action(o)
		})
	}
	
	update() {
		this.objects.update()
	}

	draw(draw, guiDraw) {
		this.objects.draw(draw, guiDraw)
	}
}
