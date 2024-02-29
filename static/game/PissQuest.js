export class PissQuest {
	constructor(world) {
		this.cleanedPisses = 0

		this.runAll = new RunAll(Random.positions(-900, -200, -200, 3000, 20).map(position => {
			position.width = 200
			position.height = 200
			const piss = new Piss(world.deliveryDrone, world.mouse, position)
			piss.onFinish = () => {
				this.cleanedPisses += 1
			}

			return piss
		}))
	}

	update() {
		RunOnce(this.cleanedPisses == 1, () => {
			Call(this.onFinish)
		})

		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
	}

}
