export class MonsterWave {
	constructor(maxEnemies, onCompeted = () => {}) {
		this.killed = 0

		this.localObjects = new LocalObjects([
			OnTrue(() => this.completed(), () => {
				onCompeted()
			}),
			new Every(120, () => {
				new Monster(new Tilemaps().enemyWalkTiles,
					() => {
						this.killed += 1
						Html.changeText(this.p, this.killed + "/" + this.maxEnemies)
					})
			}, maxEnemies)
		])

		Html.upperLeft([
			Html.div('', [
				Html.p('kill count'),
				this.p = Html.p(""),
			])
		])
	}

	completed() {
		return this.killed >= this.maxEnemies
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
