export class PissQuest {
	constructor(deliveryDrone) {
		this.cleanedPisses = 0

		deliveryDrone.compass.clear()

		this.localObjects = new LocalObjects(Random.positions(0, 200, -200, 3000, 20).map(position => {
			position.width = 200
			position.height = 200

			deliveryDrone.compass.add(position, 'yellow')

			const piss = new Piss(deliveryDrone, position)
			piss.onFinish = () => {
				this.cleanedPisses += 1
				deliveryDrone.compass.remove(position, 'yellow')
			}

			return piss
		}))
	}

	update() {
		RunOnce(this.cleanedPisses == 20, () => {
			Call(this.onFinish)
		})

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
