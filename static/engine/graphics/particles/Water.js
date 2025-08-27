export class Water {
	constructor() {

		this.droplets = Random.positions(-300, 300, -300, 300, 100).map(p => {
			const waterDroplet = new DynamicGameObject(new Position (x, y, width, height), 10, 1000)

			waterDroplet.originalPosition = {
				x: waterDroplet.x,
				y: waterDroplet.y,
			}

			return waterDroplet
		})
	}

	draw() {
		this.droplets.forEach(d => {
			Draw.blue(d)
		})
	}
}
