import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Every } from '/static/engine/on/Every.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { TileSheet } from '/static/game/tiles/TileSheet.js'; 

export class MonsterWave {
	constructor(maxEnemies, onCompleted = () => {}) {

				AssertNotNull(maxEnemies, "argument maxEnemies in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onCompleted, "argument onCompleted in " + this.constructor.name + ".js should not be null")
			
		this.maxEnemies = maxEnemies; 
		this.onCompleted = onCompleted; 

		this.killed = 0

		this.localObjects = new LocalObjects([
			new OnTrue(() => this.completed(), () => {
				onCompleted()
			}),
			Every(120, () => {
				new Monster(G.TileSheet.world.enemyWalkTiles,
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
