export class PissQuest {
	constructor(world) {
		this.cleanedPisses = 0

		this.runAll = new RunAll(Random.positions(-900, -200, -200, 3000, 1).map(position => {
			position.width = 200
			position.height = 200
			const piss = new Piss(world.player, world.mouse, position)
			piss.onFinish = () => {
				this.cleanedPisses += 1
			}

			return piss
		}))

		this.firstTimeFinish = new FirstTimeFinish(() => this.cleanedPisses == 100)
	}

	update() {
		if (this.firstTimeFinish.returnTrueIfFinishedOnce()) {
			Call(this.onFinish)
		}

		this.runAll.update()
	}


	draw(draw) {
		this.runAll.draw(draw)
	}

}
