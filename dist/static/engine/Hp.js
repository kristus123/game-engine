import { Loop } from '/static/engine/Loop.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Hp {
	constructor(object, killed=() => {}) {

				AssertNotNull(object, "argument object in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(killed, "argument killed in " + this.constructor.name + ".js should not be null")
			
		this.object = object; 
		this.killed = killed; 

		this.currentHp = 100
		this.maxHp = 100
	}

	get dead() {
		return this.currentHp <= 0
	}

	damage(amount) {
		this.currentHp -= amount
	}

	update() {
		if (this.dead) {
			this.killed()
			this.removeFromLoop()
			this.object.removeFromLoop()
		}
	}

	draw(draw, guiDraw) {
		draw.hpBar(this.object.position.offset(100, -100), this.currentHp, this.maxHp)
	}
}
