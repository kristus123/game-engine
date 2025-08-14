export class MonsterWave {
	constructor(tilemaps, killGoal) {
		this.killed = 0

		this.localObjects = new LocalObjects([
			this.after = new After(500, () => {
				tla(new Monster(tilemaps.enemyWalkTiles, () => {
					this.killed += 1
					Html.changeText(this.p, this.killed)
				}))
			}),
		])

		Html.upperLeft([
			Html.div('', [
				Html.p('kill count'),
				this.p = Html.p(this.killed),
			])
		])
	}

	completed() {
		const c = this.killed >= this.killGoal
		if (c) {
			for (const o of this.localObjects) {
				o.removeFromLoop()
				G.monsters.remove(o)
			}
			return true
		}
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
