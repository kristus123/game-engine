import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Every } from '/static/engine/on/Every.js'; 
import { Monster } from '/static/game/Monster.js'; 

export class MonsterWave {
	constructor(tilemaps, killGoal) {

				AssertNotNull(tilemaps, "argument tilemaps in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(killGoal, "argument killGoal in " + this.constructor.name + ".js should not be null")
			
		this.tilemaps = tilemaps; 
		this.killGoal = killGoal; 

		this.killed = 0

		this.localObjects = new LocalObjects([
			new Every(50, () => {
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
