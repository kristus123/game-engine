import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { After } from '/static/engine/on/After.js'; 
import { Monster } from '/static/game/Monster.js'; 

export class MonsterWave {
	constructor(tilemaps) {

				AssertNotNull(tilemaps, "argument tilemaps in " + this.constructor.name + ".js should not be null")
			
		this.tilemaps = tilemaps; 

		this.killed = 0

		this.localObjects = new LocalObjects([
			this.after = new After(500, () => {
				this.localObjects.add(new Monster(tilemaps.enemyWalkTiles, () => {
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
		this.killed >= 20
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
