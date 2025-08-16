import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Every } from '/static/engine/on/Every.js'; 
import { OnTrue } from '/static/engine/on/OnTrue.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { Tilemaps } from '/static/game/Tilemaps.js'; 

export class MonsterWave {
	constructor(maxEnemies, onCompeted = () => {}) {

				AssertNotNull(maxEnemies, "argument maxEnemies in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onCompeted, "argument onCompeted in " + this.constructor.name + ".js should not be null")
			
		this.maxEnemies = maxEnemies; 
		this.onCompeted = onCompeted; 

		this.killed = 0

		this.localObjects = new LocalObjects([
			new OnTrue(() => this.completed(), () => {
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
