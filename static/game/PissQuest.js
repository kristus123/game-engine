

export class PissQuest {
	constructor(world) {
		this.pisses = Random.positions(-200, 500, -200, 500, 2).map(position => {
			return new Piss(world.player, world.mouse, position)
		})

		this.cleanedPisses = 0

	}

	update() {
		this.pisses.forEach((piss) => {
			if (piss?.firstTimeFinish.returnTrueIfFinishedOnce()) {
				this.cleanedPisses += 1
			}
		})


		if (this.cleanedPisses === this.pisses.length) {
			Call(this.onFinish)
		}
	}


	draw(draw) {
		this.pisses.forEach((piss) => {
			piss.draw(draw)
		})
	}

}