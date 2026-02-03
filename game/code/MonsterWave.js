export class MonsterWave {
	constructor(maxEnemies, onCompleted = () => {}) {
		this.killed = 0

		this.localObjects = LocalObjects([
			OnTrue(() => this.completed(), () => {
				onCompleted()
			}),
			Every(120, () => {
				new Monster(G.x.world.enemyWalkTiles,
					() => {
						this.killed += 1
						this.p.changeText(this.killed + '/' + this.maxEnemies)
					})
			}, maxEnemies)
		])

		Html.upperLeft([
			Html.div('', [
				Html.p('kill count'),
				this.p = Html.p(''),
			])
		])
	}

	completed() {
		return this.killed >= this.maxEnemies
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
