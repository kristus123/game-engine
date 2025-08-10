import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class Charge {
	constructor(chargePerUpdate, maxCharge) {

				AssertNotNull(chargePerUpdate, "argument chargePerUpdate in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(maxCharge, "argument maxCharge in " + this.constructor.name + ".js should not be null")
			
		this.chargePerUpdate = chargePerUpdate; 
		this.maxCharge = maxCharge; 

		this.charge = maxCharge


		this.onExhaust = () => {}

		this.onReady = () => {}
		this.onReadyTriggered = false
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
		this.charge += this.chargePerUpdate

		if (this.ready && !this.onReadyTriggered) {
			this.onReady()
			this.onReadyTriggered = true
		}
	}

	draw(draw, guiDraw) {
	}
}
