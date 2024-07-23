export class Charge {
	constructor(chargePerUpdate, maxCharge) {
		this.charge = maxCharge
	}

	ready() {
		return this.charge >= this.maxCharge
	}

	exhaust() {
		this.charge = 0
	}

	update() {
		this.charge += this.chargePerUpdate
	}

	draw(draw, guiDraw) {
	}
}
