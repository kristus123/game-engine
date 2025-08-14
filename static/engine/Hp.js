export class Hp {
	constructor(object, killed=() => {}) {
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
		}
	}

	draw(draw, guiDraw) {
		draw.hpBar(this.object.position.offset(100, -100), this.currentHp, this.maxHp)
	}
}
