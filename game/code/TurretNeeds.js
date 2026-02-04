export class TurretNeeds {
	constructor(turret) {
		this.chokolate = false
		this.localObjects = Objects([
			Every(1_000, () => {
			})
		])
	}


	get needsSomething() {
		return this.chokolate
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)

		if (this.chokolate) {
			if (G.player.within(100, this.turret)) {
				Html.fadeaway('thanks!', this.turret.position.offset(-200))
				this.chokolate = false
			}
			else {
				draw.text(this.turret.position.over(20), 'cooka!!!!!')
			}
		}
	}

}
