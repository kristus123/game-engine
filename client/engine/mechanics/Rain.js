export class Rain {
	constructor(position) {
		this.localObjects = Objects()

		setInterval(() => {
			const rainDrop = Square(Random.positionWithin(position), 1)

			rainDrop.update = () => {
				rainDrop.pushTowards(rainDrop.position.offset(0, 100), 0.1)
				setTimeout(() => {
					this.localObjects.remove(rainDrop)
				}, 8_000)
			}
			this.localObjects.add(rainDrop)
		}, 100)
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
