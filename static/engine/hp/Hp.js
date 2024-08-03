export class Hp {
	constructor(object, currentHp=100, maxHp=100, killed=() => {}) {
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
		draw.hpBar(this.object, this.currentHp, this.maxHp)
	}
}
