import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Hp {
	constructor(object, onKill=() => {}) {

				AssertNotNull(object, "argument object in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onKill, "argument onKill in " + this.constructor.name + ".js should not be null")
			
		this.object = object; 
		this.onKill = onKill; 

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
			this.onKill()
		}
	}

	draw(draw) {
		draw.hpBar(this.object.position.offset(100, -100), this.currentHp, this.maxHp)
	}
}
