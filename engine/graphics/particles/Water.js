export class Water {
	constructor() {

		this.droplets = Random.positions(-300, 300, -300, 300, 100).map(p => {
			const waterDroplet = DynamicGameObject(Position (x, y, width, height), 10, 1000)

			waterDroplet.originalPosition = {
				x: waterDroplet.x,
				y: waterDroplet.y,
			}

			return waterDroplet
		})
	}

	draw(draw) {
		this.droplets.forEach(d => {
			draw.blue(d)
		})
	}
}
