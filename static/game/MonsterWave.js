export class MonsterWave {
	constructor(tilemaps, killGoal) {
		this.killed = 0

		this.localObjects = new LocalObjects([
			new Every(500, () => {
				new Monster(tilemaps.enemyWalkTiles,
					() => {
						this.killed += 1
						Html.changeText(this.p, this.killed)
					})
			}, killGoal)
		])

		Html.upperLeft([
			Html.div('', [
				Html.p('kill count'),
				this.p = Html.p(this.killed),
			])
		])
	}

	completed() {
		return this.killed >= this.killGoal
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
