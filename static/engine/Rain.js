export class Rain {
	constructor(position) {
		this.localObjects = new LocalObjects()


		setInterval(() => {
			const rainDrop = new Square(Random.positionWithin(position), 10)

			rainDrop.update = () => {
				Push(rainDrop).towards(rainDrop.position.offset(0, 100))
				setTimeout(() => {
					this.localObjects.remove(rainDrop)
				}, 8_000);
			}
			this.localObjects.add(rainDrop)
		}, 50);
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
