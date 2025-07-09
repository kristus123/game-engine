import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 

export class Hp {
	constructor(object, currentHp=100, maxHp=100, killed=() => {}) {

				AssertNotNull(object, "argument object in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(currentHp, "argument currentHp in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(maxHp, "argument maxHp in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(killed, "argument killed in " + this.constructor.name + ".js should not be null")
			
		this.object = object; 
		this.currentHp = currentHp; 
		this.maxHp = maxHp; 
		this.killed = killed; 

	}

	get dead() {
		return this.currentHp <= 0
	}

	update() {
		if (this.dead) {
			this.killed()
			this.removeFromLoop()
		}
	}

	draw(draw, guiDraw) {
		draw.hpBar(this.object.position.offset(100, -100), this.currentHp, this.maxHp)
	}
}
