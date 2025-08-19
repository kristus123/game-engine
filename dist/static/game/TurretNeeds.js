import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Html } from '/static/engine/html/Html.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Every } from '/static/engine/on/Every.js'; 

export class TurretNeeds {
	constructor(turret) {

				AssertNotNull(turret, "argument turret in " + this.constructor.name + ".js should not be null")
			
		this.turret = turret; 

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

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.chokolate) {
			if (G.player.within(100, this.turret)) {
				Html.fadeaway('thanks!', this.turret.position.offset(-200))
				this.chokolate = false
			}
			else {
				draw.text(this.turret.position.over(20), 'cooka!!!!!')
			}
		}
	}

}
