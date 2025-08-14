export class MonsterWave {
	constructor(tilemaps, killGoal) {
		this.killed = 0

		this.localObjects = new LocalObjects([
			this.after = new After(500, () => {
				new Monster(tilemaps.enemyWalkTiles, () => {
					this.killed += 1
					Html.changeText(this.p, this.killed)
				})
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
		const ok = this.killed >= this.killGoal
		if (ok) {
			G.monsters.removeAll()
			console.log("remoremo AllObjects")
			return true
		}
		else {
			return false
		}
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
