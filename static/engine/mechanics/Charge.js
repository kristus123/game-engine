export class Charge {
	constructor(chargePerUpdate, maxCharge) {
		this.charge = maxCharge


		this.onExhaust = () => {}

		this.onReady = () => {}
		this.onReadyTriggered = false


		this.position = null
	}

	get ready() {
		return this.charge >= this.maxCharge
	}

	exhaust() {
		this.charge = 0
		this.onExhaust()

		this.onReadyTriggered = false
	}

	update() {
		if (this.ready) {
			this.charge = this.maxCharge
		}
		else {
			this.charge += this.chargePerUpdate
		}

		if (this.ready && !this.onReadyTriggered) {
			this.onReady()
			this.onReadyTriggered = true
		}
	}

	draw(draw) {
		if (this.position) {
			if (this.ready) {
				draw.hpBar(this.position, this.charge, this.maxCharge, 'green')
			}
			else {
				draw.hpBar(this.position, this.charge, this.maxCharge, 'orange')
			}
		}
	}
}
