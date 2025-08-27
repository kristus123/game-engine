export class TurretNeeds {
	constructor(turret) {
		this.chokolate = false
		this.localObjects = new LocalObjects([
			new Every(1_000, () => {
			})
		])
	}


	get needsSomething() {
		return this.chokolate
	}

	update() {
		this.localObjects.update()
	}

	draw() {
		this.localObjects.draw()

		if (this.chokolate) {
			if (G.player.within(100, this.turret)) {
				Html.fadeaway('thanks!', this.turret.position.offset(-200))
				this.chokolate = false
			}
			else {
				Draw.text(this.turret.position.over(20), 'cooka!!!!!')
			}
		}
	}

}
